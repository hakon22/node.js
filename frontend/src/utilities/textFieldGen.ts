const textFieldGen = (field: string) => {
  if (field === 'username') return { label: 'Имя', placeholder: 'Введите имя', type: 'text' };
  if (field === 'email') return { label: 'Почта', placeholder: 'Введите почту', type: 'email' };
  return { label: 'Пароль', placeholder: 'Введите пароль', type: 'password' };
};

export default textFieldGen;
