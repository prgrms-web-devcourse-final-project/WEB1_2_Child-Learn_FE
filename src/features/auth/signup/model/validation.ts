export const joinValidation = {
  loginId: {
    required: '아이디를 입력해주세요.',
    pattern: {
      value: /^[a-zA-Z0-9]{4,12}$/,
      message: '4-12자의 영문, 숫자만 사용 가능합니다.',
    },
  },
  pw: {
    required: '비밀번호를 입력해주세요.',
    pattern: {
      value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
      message: '8자 이상의 영문, 숫자, 특수기호를 포함해야 합니다.',
    },
  },
  username: {
    required: '닉네임을 입력해주세요.',
    pattern: {
      value: /^[가-힣a-zA-Z0-9]{1,8}$/,
      message: '최대 8자까지의 한글, 영문, 숫자만 입력 가능합니다.',
    },
  },
  email: {
    required: '이메일을 입력해주세요.',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: '올바른 이메일 형식이 아닙니다.',
    },
  },
  birth: {
    required: '생년월일을 입력해주세요.',
    pattern: {
      value: /^\d{8}$/,
      message: 'YYYYMMDD 형식으로 입력해주세요.',
    },
  },
};
