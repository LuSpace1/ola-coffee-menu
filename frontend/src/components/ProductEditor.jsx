import React, { useState, useEffect } from "react";
import { X, Save, ChevronDown, RotateCcw } from "lucide-react";

export default function ProductEditor({ product, onSave, onClose, onChange }) {
  const isEditing = product.id !== undefined;
  const title = isEditing ? "Editar Producto" : "Nuevo Producto";

  // Estado para controlar si mostramos el input manual
  const [isAddingNew, setIsAddingNew] = useState(false);

  const CATEGORIES = [
    "Special",
    "(Not) Coffee",
    "Coffee",
    "Chocolate",
    "Dulce",
    "Salado",
    "Bowls",
    "Brunch",
    "Smash Cookie",
  ];

  const handleFieldChange = (field, value) => {
    onChange({
      ...product,
      [field]: value,
    });
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === "NEW_CATEGORY") {
      setIsAddingNew(true);
      handleFieldChange("category", ""); // Limpiamos para que escriba desde cero
    } else {
      handleFieldChange("category", value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-[#3A3530]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#A69984] hover:text-[#3A3530]"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-[#3A3530] mb-2 uppercase tracking-wider">
              Nombre
            </label>
            <input
              type="text"
              value={product.name || ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="w-full p-3 border-2 border-[#EBE3D5] rounded-xl focus:border-[#3A3530] outline-none"
              required
            />
          </div>

          {/* Categoría Dinámica */}
          <div>
            <label className="block text-xs font-bold text-[#3A3530] mb-2 uppercase tracking-wider">
              Categoría
            </label>

            {!isAddingNew ? (
              <div className="relative">
                <select
                  value={product.category || ""}
                  onChange={handleSelectChange}
                  className="w-full p-3 border-2 border-[#EBE3D5] rounded-xl focus:border-[#3A3530] outline-none appearance-none bg-white cursor-pointer"
                  required
                >
                  <option value="" disabled>
                    Selecciona una categoría
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option
                    value="NEW_CATEGORY"
                    className="font-bold text-blue-600"
                  >
                    + Ingresar categoría nueva
                  </option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A69984] pointer-events-none"
                  size={18}
                />
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="Escribe la nueva categoría..."
                  value={product.category || ""}
                  onChange={(e) =>
                    handleFieldChange("category", e.target.value)
                  }
                  className="flex-1 p-3 border-2 border-[#3A3530] rounded-xl outline-none bg-[#F8F6F0]"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    handleFieldChange("category", "");
                  }}
                  className="p-3 border-2 border-[#EBE3D5] rounded-xl text-[#A69984] hover:text-[#3A3530] transition-colors"
                  title="Volver a la lista"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Precio */}
          <div>
            <label className="block text-xs font-bold text-[#3A3530] mb-2 uppercase tracking-wider">
              Precio (CLP)
            </label>
            <input
              type="number"
              value={product.price || ""}
              onChange={(e) =>
                handleFieldChange("price", parseInt(e.target.value) || 0)
              }
              className="w-full p-3 border-2 border-[#EBE3D5] rounded-xl focus:border-[#3A3530] outline-none"
              required
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

          {/* Botones Guardar/Cancelar */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-[#EBE3D5] rounded-xl font-bold text-[#3A3530]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#3A3530] text-white rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Save size={18} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
