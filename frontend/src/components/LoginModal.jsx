import React from 'react';
import { X } from 'lucide-react';

export default function LoginModal({ 
  onSubmit, 
  onClose, 
  password, 
  onPasswordChange 
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <button
          onClick={onClose}
          className="float-right text-[#A69984] hover:text-[#3A3530] transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black text-[#3A3530] mb-6">
          Panel de Control
        </h2>

        <form onSubmit={onSubmit}>
          <input
            type="password"
            placeholder="Ingresa el PIN"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="w-full p-4 border-2 border-[#EBE3D5] rounded-2xl mb-4 focus:outline-none focus:border-[#3A3530] transition-colors"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-[#3A3530] text-white p-4 rounded-2xl font-black shadow-lg active:scale-95 transition-transform"
          >
            ACCEDER
          </button>
        </form>
      </div>
    </div>
  );
}
