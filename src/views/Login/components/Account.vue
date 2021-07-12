<template>
  <el-form ref="ruleFormRef" :rules="rules" class="login-content-form" :model="ruleForm">
    <el-form-item prop="userName">
      <el-input
        v-model="ruleForm.userName"
        type="text"
        placeholder="请输入用户名"
        prefix-icon="el-icon-user"
        clearable
        autocomplete="off"
      >
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="ruleForm.password"
        :type="isShowPassword ? 'text' : 'password'"
        placeholder="请输入用户密码"
        prefix-icon="el-icon-lock"
        show-password
        autocomplete="off"
      >
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-row :gutter="15">
        <el-col :span="16">
          <el-input
            v-model="ruleForm.code"
            type="text"
            maxlength="4"
            placeholder="请输入验证码"
            prefix-icon="el-icon-position"
            clearable
            autocomplete="off"
          ></el-input>
        </el-col>
        <el-col :span="8">
          <div class="flex items-center justify-center shadow-md cursor-pointer">
            <span class="italic">1234</span>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item class="mb-0">
      <el-button type="primary" class="w-full" round :loading="loading" @click="onSignIn"> 登陆 </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, reactive, toRefs, ref } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'LoginAccount',
  setup() {
    const router = useRouter();
    const { dispatch } = useStore();
    const state = reactive({
      ruleForm: {
        userName: 'admin',
        password: 'admin',
        code: '1234',
      },
      rules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
      },
      loading: false,
      isShowPassword: false,
    });
    const domRef = {
      ruleFormRef: ref(),
    };
    const methods = {
      onSignIn() {
        domRef.ruleFormRef.value.validate((valid: boolean) => {
          if (valid) {
            methods.userLogin();
            router.replace('/');
          }
        });
      },
      userLogin() {
        // TODO: fetch API
        dispatch('user/login', {
          password: state.ruleForm.password,
          username: state.ruleForm.userName,
        });
      },
    };
    return {
      ...toRefs(state),
      ...methods,
      ...domRef,
    };
  },
});
</script>
