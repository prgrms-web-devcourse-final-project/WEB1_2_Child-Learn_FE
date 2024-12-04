export const joinValidation = {
  loginId: {
    required: '아이디를 입력해주세요.',
    pattern: {
      value: /^[a-zA-Z0-9]{5,20}$/,
      message: '5-20자의 영문, 숫자만 사용 가능합니다.',
    },
  },
  pw: {
    required: '비밀번호를 입력해주세요.',
    pattern: {
      value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/,
      message:
        '비밀번호는 8-30자의 영문, 숫자, 특수문자(@$!%*#?&)를 포함해야 합니다.',
    },
  },
  username: {
    required: '닉네임을 입력해주세요.',
    pattern: {
      value: /^[가-힣a-zA-Z0-9]{2,8}$/,
      message: '2-8자의 한글, 영문, 숫자만 입력 가능합니다.',
    },
  },
  email: {
    required: '이메일을 입력해주세요.',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: '올바른 이메일 형식이 아닙니다.',
    },
    maxLength: {
      value: 50,
      message: '이메일은 최대 50자까지 가능합니다.',
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
