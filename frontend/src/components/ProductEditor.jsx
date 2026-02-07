import React from 'react';
import { X, Save } from 'lucide-react';

export default function ProductEditor({ 
  product, 
  onSave, 
  onClose, 
  onChange 
}) {
  const isEditing = product.id !== undefined;
  const title = isEditing ? 'Editar Producto' : 'Nuevo Producto';

  const handleFieldChange = (field, value) => {
    onChange({
      ...product,
      [field]: value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-[#3A3530]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[#A69984] hover:text-[#3A3530] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3A3530] mb-2 uppercase tracking-wider">
              Nombre
            </label>
            <input
              type="text"
              value={product.name || ''}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className="w-full p-3 border-2 border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3A3530] transition-colors"
              placeholder="Ej: Latte"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3A3530] mb-2 uppercase tracking-wider">
              Categoría
            </label>
            <input
              type="text"
              list="categories"
              value={product.category || ''}
              onChange={(e) => handleFieldChange('category', e.target.value)}
              className="w-full p-3 border-2 border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3A3530] transition-colors"
              placeholder="Escribe o selecciona una categoría"
              required
            />
            <datalist id="categories">
              <option value="(Not) Coffee" />
              <option value="Coffee" />
              <option value="Chocolate" />
              <option value="Dulce" />
              <option value="Salado" />
              <option value="Bowls" />
              <option value="Brunch" />
              <option value="Smash Cookie" />
            </datalist>
            <p className="text-[10px] text-[#A69984] mt-1">
              Puedes escribir una nueva categoría o seleccionar una existente
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3A3530] mb-2 uppercase tracking-wider">
              Precio (CLP)
            </label>
            <input
              type="number"
              value={product.price || ''}
              onChange={(e) => handleFieldChange('price', parseInt(e.target.value) || 0)}
              className="w-full p-3 border-2 border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3A3530] transition-colors"
              placeholder="Ej: 3500"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3A3530] mb-2 uppercase tracking-wider">
              Descripción (Opcional)
            </label>
            <textarea
              value={product.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="w-full p-3 border-2 border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3A3530] transition-colors resize-none"
              placeholder="Descripción breve del producto"
              rows="3"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="available"
              checked={product.available !== false}
              onChange={(e) => handleFieldChange('available', e.target.checked)}
              className="w-5 h-5 rounded border-2 border-[#EBE3D5] text-[#3A3530] focus:ring-[#3A3530]"
            />
            <label htmlFor="available" className="text-sm font-bold text-[#3A3530]">
              Producto disponible
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-[#EBE3D5] text-[#3A3530] rounded-xl font-bold hover:bg-[#F8F6F0] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#3A3530] text-white rounded-xl font-bold hover:bg-[#2a2622] transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
