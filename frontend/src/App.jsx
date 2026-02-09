import React, { useState, useEffect, useMemo } from "react";
import { Plus, Loader2, List } from "lucide-react";
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
              >
                {cat}
              </button>
            );
          })}
        </div>

        {isAdmin && (
          <button
            onClick={() => openEditor({})}
            className="w-full mb-6 bg-gradient-to-r from-[#3A3530] to-[#2a2622] text-white p-4 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            NUEVO PRODUCTO
          </button>
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
