import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function RegisterForm({ onSuccess }) {
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  });

  const password = watch('password');
  const { signup } = useAuth();

  const onValid = async (formData) => {
    setErrorMessage('');

    try {
      // llama a signup del Authprovider
      await signup(formData.username, formData.email, formData.password);

      // si todo salió bien:
      if (onSuccess) onSuccess();
    } catch (error) {
      // si axios tira error, cae acá
      if (error?.response?.data?.code) {
        setErrorMessage(
          frontendErrorMessage[error.response.data.code] ||
            'No se pudo registrar el usuario'
        );
      } else {
        setErrorMessage('No se pudo registrar el usuario');
      }
    }
  };

  return (
    <form
      className="
        flex
        flex-col
        gap-4
      "
      onSubmit={handleSubmit(onValid)}
    >
      <Input
        label="Usuario"
        {...register('username', {
          required: 'Usuario es obligatorio',
        })}
        error={errors.username?.message}
      />

      <Input
        label="Email"
        {...register('email', {
          required: 'El email es obligatorio',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Ingrese un email válido',
          },
        })}
        error={errors.email?.message}
      />

      <Input
        label="Contraseña"
        type="password"
        {...register('password', {
          required: 'Contraseña es obligatoria',
          minLength: {
            value: 6,
            message: 'Mínimo 6 caracteres',
          },
        })}
        error={errors.password?.message}
      />

      <Input
        label="Confirmar contraseña"
        type="password"
        {...register('confirmPassword', {
          required: 'Confirmar contraseña es obligatorio',
          validate: (value) =>
            value === password || 'Las contraseñas no coinciden',
        })}
        error={errors.confirmPassword?.message}
      />

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <Button type="submit">Registrar Usuario</Button>
    </form>
  );
}

export default RegisterForm;