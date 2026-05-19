import React, { useState, useEffect } from 'react';
import { X, Mail, ShieldCheck, KeyRound, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import * as API from '../api';

export default function LoginModal({
  onSubmit,
  onClose,
  password,
  onPasswordChange
}) {
  const [mode, setMode] = useState('login'); // 'login', 'recover'
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasRecoveryEmail, setHasRecoveryEmail] = useState(false);

  useEffect(() => {
    // Verificamos si se configuró el correo alguna vez
    API.checkHasEmail().then(res => setHasRecoveryEmail(res.hasEmail));
  }, []);

  const handleRequestRecovery = async () => {
    if (!hasRecoveryEmail) {
      Swal.fire({
        icon: 'error',
        title: 'Sin correo',
        text: 'No hay un correo de recuperación configurado en el sistema.',
        confirmButtonColor: '#3A3530'
      });
      return;
    }

    setLoading(true);
    try {
      await API.requestRecovery();
      setMode('recover');
      Swal.fire({
        icon: 'success',
        title: 'Correo enviado',
        text: 'Revisa el correo del administrador. Ingresa el PIN enviado.',
        timer: 3000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message, confirmButtonColor: '#3A3530' });
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverSubmit = async (e) => {
    e.preventDefault();
    if (!pin || !newPassword) return;

    setLoading(true);
    try {
      await API.verifyPinAndChangePassword(pin, newPassword);
      Swal.fire({
        icon: 'success',
        title: '¡Contraseña Actualizada!',
        text: 'Ya puedes iniciar sesión con tu nueva contraseña.',
        confirmButtonColor: '#3A3530'
      });
      setMode('login');
      setPin('');
      setNewPassword('');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message, confirmButtonColor: '#3A3530' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A69984] hover:text-[#3A3530] transition-colors"
        >
          <X size={24} />
        </button>

        {mode === 'login' ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="bg-[#F8F6F0] p-4 rounded-full">
                <KeyRound size={32} className="text-[#3A3530]" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-[#3A3530] text-center mb-6">
              Panel de Control
            </h2>

            <form onSubmit={onSubmit}>
              <input
                type="password"
                placeholder="Ingresa la contraseña"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className="w-full p-4 border-2 border-[#EBE3D5] rounded-2xl mb-4 focus:outline-none focus:border-[#3A3530] transition-colors text-center font-bold tracking-widest"
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-[#3A3530] text-white p-4 rounded-2xl font-black shadow-lg active:scale-95 transition-transform hover:bg-[#2A2622]"
              >
                ACCEDER
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={handleRequestRecovery}
                disabled={loading}
                className="text-sm font-bold text-[#A69984] hover:text-[#3A3530] transition-colors"
              >
                {loading ? 'Enviando...' : '¿Olvidaste la Contraseña?'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="bg-[#F8F6F0] p-4 rounded-full">
                <ShieldCheck size={32} className="text-[#3A3530]" />
              </div>
            </div>

            <h2 className="text-xl font-black text-[#3A3530] text-center mb-2">
              Recuperar Acceso
            </h2>
            <p className="text-center text-sm text-[#A69984] mb-6">
              Ingresa el <span className="font-bold text-[#3A3530]">PIN de 6 dígitos</span> enviado al correo y define una nueva contraseña.
            </p>

            <form onSubmit={handleRecoverSubmit}>
              <input
                type="text"
                placeholder="PIN (ej: 123456)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={6}
                required
                className="w-full p-4 border-2 border-[#EBE3D5] rounded-2xl mb-3 focus:outline-none focus:border-[#3A3530] transition-colors text-center font-bold tracking-[0.5em]"
                autoFocus
              />
              <div className="relative mb-4">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Nueva Contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full p-4 border-2 border-[#EBE3D5] rounded-2xl focus:outline-none focus:border-[#3A3530] transition-colors text-center font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A69984] hover:text-[#3A3530] transition-colors p-2"
                  title={showNewPassword ? "Ocultar Contraseña" : "Ver Contraseña"}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3A3530] text-white p-4 rounded-2xl font-black shadow-lg active:scale-95 transition-transform disabled:opacity-50 hover:bg-[#2A2622]"
              >
                {loading ? 'MODIFICANDO...' : 'CAMBIAR CONTRASEÑA'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setMode('login')}
                className="text-sm font-bold text-[#A69984] hover:text-[#3A3530] transition-colors"
              >
                Volver a Iniciar Sesión
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
