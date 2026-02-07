import React from 'react';
import { CheckCircle2, XCircle, Edit2, Trash2 } from 'lucide-react';

export default function ProductCard({ 
  product, 
  isAdmin, 
  onToggleStock, 
  onEdit, 
  onDelete 
}) {
  const formatPrice = (price) => {
    return `$${price.toLocaleString('es-CL')}`;
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EBE3D5] hover:shadow-md transition-all relative overflow-hidden">
      {!product.available && !isAdmin && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="bg-[#3A3530] text-white text-[10px] font-black px-4 py-2 rounded-full -rotate-6 uppercase shadow-xl tracking-widest border border-white/20">
            No disponible
          </span>
        </div>
      )}

      <div className={!product.available && !isAdmin ? 'opacity-40' : ''}>
        <div className="mb-3">
          <h3 className="font-bold text-[#3A3530] text-base mb-1">
            {product.name}
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A69984]">
            {product.category}
          </span>
        </div>

        {product.description && (
          <p className="text-xs text-[#6B6560] mb-3 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="text-xl font-black text-[#3A3530]">
          {formatPrice(product.price)}
        </div>
      </div>

      {isAdmin && (
        <div className="mt-4 flex gap-2 pt-4 border-t border-[#EBE3D5]">
          <button
            onClick={() => onToggleStock(product)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              product.available
                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            {product.available ? (
              <>
                <CheckCircle2 size={16} />
                Disponible
              </>
            ) : (
              <>
                <XCircle size={16} />
                Agotado
              </>
            )}
          </button>

          <button
            onClick={() => onEdit(product)}
            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Edit2 size={16} />
          </button>

          <button
            onClick={() => onDelete(product.id)}
            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
