import React, { useState } from "react";
import { Product, Category } from "../../types";
import { Plus, Trash, Check, Sliders } from "lucide-react";

interface ProductManagerProps {
  products: Product[];
  categories: Category[];
  onAddProduct?: (p: any) => void;
  onDeleteProduct?: (id: string) => void;
  locale: string;
}

export const ProductManager: React.FC<ProductManagerProps> = ({
  products,
  categories,
  onAddProduct,
  onDeleteProduct,
  locale
}) => {
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (onAddProduct) {
      onAddProduct({
        id: "prod_" + Date.now(),
        title: newTitle,
        category: newCategory || categories[0]?.id || "bags",
        priceAMD: Number(newPrice) || 120,
        published: true
      });
    }
    setNewTitle("");
    setNewPrice(0);
  };

  return (
    <div className="w-full space-y-6 select-none">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif text-[#1A3F25] font-bold">Catalog Product Builder</h2>
          <p className="text-xs text-gray-500">Add, configure, or retire premium packaging products in the live catalog</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Add new product form */}
        <form onSubmit={handleSubmit} className="lg:col-span-4 bg-[#f0f2f5] p-6 rounded-[2rem] border border-gray-150 space-y-4">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Create Custom Packaging Product</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Product Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Rigid Magnetic Box"
              required
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-800 outline-none focus:ring-1 focus:ring-[#FF2300]/30"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Category Type</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{(c as any).titleHy || c.name || c.id}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Base Price (AMD)</label>
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(Number(e.target.value))}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-800 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#1A3F25] hover:bg-[#132f1b] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus size={12} /> Add New Product
          </button>
        </form>

        {/* Existing Products List Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Active Products ({products.length})</h3>
          
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Base Price</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-semibold text-[#1A3F25]">{(p as any).title || p.name || p.id}</td>
                    <td className="p-3 uppercase font-mono text-[10px]">{(p as any).category || p.categoryId}</td>
                    <td className="p-3">AMD {(p as any).priceAMD?.toLocaleString() || "0"}</td>
                    <td className="p-3 text-center">
                      {onDeleteProduct && (
                        <button
                          onClick={() => onDeleteProduct(String(p.id))}
                          className="p-1 hover:text-red-650 text-gray-400 rounded-lg hover:bg-red-50 cursor-pointer"
                        >
                          <Trash size={12} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
