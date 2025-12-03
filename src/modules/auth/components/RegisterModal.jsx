import Modal from '../../shared/components/Modal';
import RegisterForm from './RegisterForm';

function RegisterModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar usuario">
      <RegisterForm onSuccess={onClose} />
    </Modal>
  );
}

export default RegisterModal;