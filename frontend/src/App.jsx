import React, { useState, useEffect, useMemo } from "react";
import { Plus, Loader2, List, Edit3, Settings } from "lucide-react";
import Swal from "sweetalert2";
import * as API from "./api";

import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import ProductEditor from "./components/ProductEditor";
import LoginModal from "./components/LoginModal";

export default function App() {
  // State
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [logoClicks, setLogoClicks] = useState(0);
  const [editingItem, setEditingItem] = useState(null);

  // Computed
  const categories = useMemo(() => {
    const rawCategories = items.map((i) => i.category);
    const uniqueCats = Array.from(new Set(rawCategories));

    const otherCats = uniqueCats
      .filter(
        (cat) =>
          cat.toLowerCase() !== "special" && cat.toLowerCase() !== "specials",
      )
      .sort();

    const hasSpecials = uniqueCats.some(
      (cat) =>
        cat.toLowerCase() === "special" || cat.toLowerCase() === "specials",
    );

    if (hasSpecials) {
      return ["Todos", "Special", ...otherCats];
    }

    return ["Todos", ...otherCats];
  }, [items]);

  // Effects
  useEffect(() => {
    fetchItems();
  }, [activeCategory, searchQuery]);

  // Handlers
  const fetchItems = async () => {
    setLoading(true);
    try {
      // Validamos que la categoría activa exista, si no, volvemos a "Todos"
      const safeCategory = categories.includes(activeCategory)
        ? activeCategory
        : "Todos";
      if (safeCategory !== activeCategory) setActiveCategory("Todos");

      const data = await API.getMenu(safeCategory, searchQuery);
      setItems(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    setLogoClicks((prev) => prev + 1);
    if (logoClicks + 1 >= 3) {
      if (isAdmin) {
        setIsAdmin(false);
        Swal.fire({
          icon: "info",
          title: "Modo Cliente",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        setShowLogin(true);
      }
      setLogoClicks(0);
    }
    setTimeout(() => setLogoClicks(0), 2000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.login(password);
      setIsAdmin(true);
      setShowLogin(false);
      setPassword("");
      Swal.fire({
        icon: "success",
        title: "Acceso exitoso",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "PIN Incorrecto",
        confirmButtonColor: "#3A3530",
      });
    }
  };

  const openEditor = (item = {}) => setEditingItem(item);

  const handleToggleStock = async (item) => {
    try {
      await API.toggleStock(item.id);
      setItems(
        items.map((i) =>
          i.id === item.id ? { ...i, available: !i.available } : i,
        ),
      );
    } catch (error) {
      console.error("Error al cambiar disponibilidad:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingItem.name || !editingItem.category || !editingItem.price) {
      Swal.fire({
        icon: "warning",
        title: "Por favor completa todos los campos",
        confirmButtonColor: "#3A3530",
      });
      return;
    }
    try {
      await API.saveItem(editingItem);
      setEditingItem(null);
      fetchItems();
      Swal.fire({
        icon: "success",
        title: "Producto guardado",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: error.message,
        confirmButtonColor: "#3A3530",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar este producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3A3530",
      cancelButtonColor: "#A69984",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        await API.deleteItem(id);
        fetchItems();
        Swal.fire({
          icon: "success",
          title: "Producto eliminado",
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const handleRenameCategory = async (oldCategoryName) => {
    const { value: newCategoryName } = await Swal.fire({
      title: 'Renombrar Categoría',
      input: 'text',
      inputLabel: `Nuevo nombre para "${oldCategoryName}"`,
      inputValue: oldCategoryName,
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3A3530',
      cancelButtonColor: '#A69984',
      inputValidator: (value) => {
        if (!value || value.trim() === '') {
          return 'Debes ingresar un nombre válido'
        }
        if (value.trim() === oldCategoryName) {
          return 'El nombre debe ser diferente al actual'
        }
      }
    });

    if (newCategoryName) {
      try {
        await API.renameCategory(oldCategoryName, newCategoryName.trim());

        if (activeCategory === oldCategoryName) {
          setActiveCategory(newCategoryName.trim());
        }

        fetchItems();

        Swal.fire({
          icon: 'success',
          title: 'Categoría renombrada',
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al renombrar',
          text: error.message || 'No se pudo cambiar el nombre de la categoría',
          confirmButtonColor: '#3A3530'
        });
      }
    }
  };

  const handleConfigureEmail = async () => {
    const status = await API.checkHasEmail();
    const currentEmail = status.hasEmail ? status.email : "No configurado";

    const { value: email, isConfirmed } = await Swal.fire({
      title: 'Correo de Recuperación',
      html: `
        <div id="email-display-container" class="flex items-center justify-between bg-[#F8F6F0] p-4 rounded-xl mb-4 text-left">
           <div>
             <span class="block text-xs text-[#A69984] font-bold uppercase tracking-wider">Correo Actual</span>
             <span id="current-email-text" class="text-[#3A3530] font-black" style="word-break: break-all;">${currentEmail}</span>
           </div>
           <button type="button" id="edit-email-btn" class="p-2 bg-white rounded-lg shadow text-[#A69984] hover:text-[#3A3530] transition-colors" title="Editar Correo">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
           </button>
        </div>
        <div id="email-input-container" style="display: none;">
          <input id="swal-input-email" class="swal2-input !mx-0 !w-full !mt-0 font-bold text-center" placeholder="Nuevo correo electrónico" type="email">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3A3530',
      didOpen: () => {
        const editBtn = document.getElementById('edit-email-btn');
        const displayContainer = document.getElementById('email-display-container');
        const inputContainer = document.getElementById('email-input-container');
        const emailInput = document.getElementById('swal-input-email');

        editBtn.addEventListener('click', () => {
          displayContainer.style.display = 'none';
          inputContainer.style.display = 'block';
          emailInput.value = currentEmail !== "No configurado" ? currentEmail : '';
          emailInput.focus();
        });

        if (currentEmail === "No configurado") {
          displayContainer.style.display = 'none';
          inputContainer.style.display = 'block';
        }
      },
      preConfirm: () => {
        const inputContainer = document.getElementById('email-input-container');
        const emailInput = document.getElementById('swal-input-email');
        if (inputContainer.style.display !== 'none') {
          const val = emailInput.value.trim();
          if (!val || !val.includes('@')) {
            Swal.showValidationMessage('Ingresa un correo electrónico válido');
            return false;
          }
          return val;
        }
        return null;
      }
    });

    if (isConfirmed && email) {
      try {
        await API.updateRecoveryEmail(email);
        Swal.fire({
          icon: 'success',
          title: 'Correo Configurado',
          text: `Se usará \n${email}\n para recuperar tu acceso.`,
          confirmButtonColor: '#3A3530'
        });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.message, confirmButtonColor: '#3A3530' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6F0] to-[#EBE3D5]">
      <Header
        isAdmin={isAdmin}
        onLogoClick={handleLogoClick}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogout={() => setIsAdmin(false)}
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filtros de Categorías */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const isSpecialBtn = cat.toLowerCase() === "special";
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  relative
                  px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border
                  ${
                    isActive
                      ? isSpecialBtn
                        ? "bg-[#4A5D3F] text-white border-[#4A5D3F] shadow-lg scale-105"
                        : "bg-[#3A3530] text-white border-[#3A3530] shadow-lg"
                      : isSpecialBtn
                        ? "bg-[#E0E8D9] text-[#4A5D3F] border-[#C5D1B9] hover:bg-[#D5DFC9]"
                        : "bg-white text-[#3A3530] border-[#EBE3D5] hover:bg-[#F8F6F0]"
                  }
                `}
                style={isActive && isSpecialBtn ? { clipPath: 'inset(0 round 9999px)' } : {}}
              >
                {/* Textura granulada solo para Special activo */}
                {isActive && isSpecialBtn && (
                  <div className="absolute inset-0 pointer-events-none z-0">
                    <svg
                      className="h-full w-full opacity-[0.4] mix-blend-soft-light"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <filter id="grainy-btn">
                        <feTurbulence
                          type="fractalNoise"
                          baseFrequency="0.95"
                          numOctaves="10"
                          stitchTiles="stitch"
                        />
                        <feComponentTransfer>
                          <feFuncR type="linear" slope="1.5" intercept="-0.2" />
                          <feFuncG type="linear" slope="1.5" intercept="-0.2" />
                          <feFuncB type="linear" slope="1.5" intercept="-0.2" />
                        </feComponentTransfer>
                      </filter>
                      <rect width="100%" height="100%" filter="url(#grainy-btn)" />
                    </svg>
                  </div>
                )}
                <div className="relative z-10 flex items-center gap-2">
                  <span>{cat}</span>
                  {isAdmin && cat !== "Todos" && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameCategory(cat);
                      }}
                      className="p-1 hover:bg-black/10 rounded-full transition-colors cursor-pointer"
                      title={`Renombrar categoría ${cat}`}
                    >
                      <Edit3 size={14} className={isActive ? 'text-white' : (isSpecialBtn ? 'text-[#4A5D3F]' : 'text-[#3A3530]')} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {isAdmin && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => openEditor({})}
              className="flex-1 bg-gradient-to-r from-[#3A3530] to-[#2A2622] text-white p-4 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              NUEVO PRODUCTO
            </button>
            <button
              onClick={handleConfigureEmail}
              title="Configurar Correo de Recuperación"
              className="bg-[#EBE3D5] text-[#3A3530] p-4 rounded-2xl font-black shadow hover:bg-[#D9C4B1] transition-all flex items-center justify-center"
            >
              <Settings size={20} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-[#3A3530]" size={40} />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <List size={48} className="mx-auto text-[#A69984] mb-4" />
            <p className="text-[#A69984] font-bold">
              No hay productos en esta categoría
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                isAdmin={isAdmin}
                onToggleStock={handleToggleStock}
                onEdit={openEditor}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showLogin && (
        <LoginModal
          onSubmit={handleLoginSubmit}
          onClose={() => setShowLogin(false)}
          password={password}
          onPasswordChange={setPassword}
        />
      )}

      {editingItem && (
        <ProductEditor
          product={editingItem}
          onSave={handleSave}
          onClose={() => setEditingItem(null)}
          onChange={setEditingItem}
        />
      )}
    </div>
  );
}
