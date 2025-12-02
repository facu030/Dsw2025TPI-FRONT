import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import useAuth from "../hook/useAuth";
import { frontendErrorMessage } from "../helpers/backendError";
import RegisterModal from './RegisterModal';

function LoginForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: "", password: "" } });

  const [registerOpen, setRegisterOpen] = useState(false);

  const navigate = useNavigate();

  const { signin } = useAuth();

  const onValid = async (formData) => {
    try {
      const { error, role } = await signin(formData.username, formData.password);
  
      if (error) {
        setErrorMessage(error.frontendErrorMessage);
        return;
      }
  
      if (role === 'Admin') {
        navigate('/admin/home');
      } else {
        navigate('/');
      }
    } catch (error) {
      if (error?.response?.data?.code) {
        setErrorMessage(frontendErrorMessage[error?.response?.data?.code]);
      } else {
        setErrorMessage('Llame a soporte');
      }
    }
  };

  return (
    <>
      <form
        className="
        flex
        flex-col
        gap-20
        bg-white
        p-8
        sm:w-md
        sm:gap-4
        sm:rounded-lg
        sm:shadow-lg
      "
        onSubmit={handleSubmit(onValid)}
      >
        <Input
          label="Usuario"
          {...register("username", {
            required: "Usuario es obligatorio",
          })}
          error={errors.username?.message}
        />
        <Input
          label="Contraseña"
          {...register("password", {
            required: "Contraseña es obligatorio",
          })}
          type="password"
          error={errors.password?.message}
        />

        <Button type="submit">Iniciar Sesión</Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setRegisterOpen(true)}
        >
          Registrar Usuario
        </Button>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </form>

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
    </>
  );
}

export default LoginForm;
