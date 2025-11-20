import React, { useState, useEffect, useRef } from 'react';
import { FishProduct } from '../types';
import { supabase } from '../supabase';

interface EditProductModalProps {
  product: FishProduct;
  onSave: (originalName: string, updatedProduct: FishProduct) => void;
  onClose: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [is_fresh, setIsFresh] = useState(false);
  const [is_visible, setIsVisible] = useState(true);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImageUrl(product.image_url);
      setIsFresh(product.is_fresh || false);
      setIsVisible(product.is_visible !== false);
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      supabase.storage.from('images').upload(filePath, file).then(({ error }) => {
        if (error) {
          console.error('Error uploading image:', error);
          return;
        }
        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        setImageUrl(data.publicUrl);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(product.name, { ...product, name, price, image_url, is_fresh, is_visible });
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white font-serif">Edit Product</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="edit-product-name" className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
            <input id="edit-product-name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
          </div>
          <div>
            <label htmlFor="edit-product-price" className="block text-sm font-medium text-slate-400 mb-1">Product Price</label>
            <input id="edit-product-price" type="text" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
          </div>
          <div>
            <label htmlFor="edit-product-image" className="block text-sm font-medium text-slate-400 mb-1">Product Image</label>
            <input
              id="edit-product-image"
              type="file"
              ref={imageInputRef}
              onChange={handleImageChange}
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-300 hover:file:bg-slate-600 transition-colors"
              accept="image/*"
            />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <input type="checkbox" id="edit-is-fresh" checked={is_fresh} onChange={e => setIsFresh(e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-sky-500 focus:ring-sky-500" />
            <label htmlFor="edit-is-fresh" className="text-sm font-medium text-slate-400">Mark as "Fresh Today"</label>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <input type="checkbox" id="edit-is-visible" checked={is_visible} onChange={e => setIsVisible(e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-sky-500 focus:ring-sky-500" />
            <label htmlFor="edit-is-visible" className="text-sm font-medium text-slate-400">Show on public site</label>
          </div>
          {image_url && <img src={image_url} alt="Preview" className="mt-2 rounded-md max-h-40 object-contain mx-auto bg-slate-700" />}
          <div className="pt-4 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors font-semibold">Cancel</button>
            <button type="submit" className="bg-brand-blue hover:bg-opacity-80 text-white font-bold py-2.5 px-5 rounded-md transition-colors duration-300">Save Changes</button>
          </div>
        </form>
      </div >
    </div >
  );
};

export default EditProductModal;