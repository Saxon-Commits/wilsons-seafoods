import React from 'react';
import { FishProduct } from '../types';
import { PencilIcon } from './icons/PencilIcon';

interface ProductListProps {
  products: FishProduct[];
  isAdmin?: boolean;
  onDelete?: (productName: string) => void;
  onEdit?: (product: FishProduct) => void;
  onToggleVisibility?: (id: number) => void;
}

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const ProductCard: React.FC<{
  product: FishProduct;
  isAdmin?: boolean;
  onDelete?: (productName: string) => void;
  onEdit?: (product: FishProduct) => void;
  onToggleVisibility?: (id: number) => void;
}> = ({ product, isAdmin, onDelete, onEdit, onToggleVisibility }) => (
  <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700 hover:border-brand-blue/50 hover:shadow-2xl hover:shadow-brand-blue/10 transform hover:-translate-y-2 transition-all duration-300 flex flex-col text-left relative group">
    {product.is_fresh && (
      <div className="absolute top-4 left-4 z-10 bg-brand-blue text-white text-xs font-bold uppercase px-3 py-1 rounded-full shadow">
        Fresh Today
      </div>
    )}
    {!product.is_visible && (
      <div className="absolute top-4 right-14 z-10 bg-slate-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full shadow">
        Hidden
      </div>
    )}
    {isAdmin && (
      <div className="absolute top-3 right-3 z-10 flex space-x-2">
        {onToggleVisibility && product.id && (
          <button
            onClick={() => onToggleVisibility(product.id!)}
            className={`p-1.5 rounded-full bg-slate-900/60 transition-colors ${product.is_visible !== false ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
            aria-label={product.is_visible !== false ? "Hide product" : "Show product"}
          >
            {product.is_visible !== false ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 rounded-full bg-slate-900/60 text-slate-400 hover:bg-sky-600 hover:text-white transition-colors"
            aria-label={`Edit ${product.name}`}
          >
            <PencilIcon />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(product.name)}
            className="p-1.5 rounded-full bg-slate-900/60 text-slate-400 hover:bg-red-600 hover:text-white transition-colors"
            aria-label={`Delete ${product.name}`}
          >
            <XIcon />
          </button>
        )}
      </div>
    )}
    <div className="overflow-hidden">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
      />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-2xl font-serif font-bold text-white mb-2">{product.name}</h3>
      <div className="flex-grow" />
      <p className="text-3xl font-bold text-ice-blue mt-4">{product.price}</p>
    </div>
  </div>
);

const ProductList: React.FC<ProductListProps> = ({ products, isAdmin = false, onDelete, onEdit, onToggleVisibility }) => {
  return (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id || product.name} product={product} isAdmin={isAdmin} onDelete={onDelete} onEdit={onEdit} onToggleVisibility={onToggleVisibility} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-slate-400 text-xl">No products found.</p>
        </div>
      )}
    </>
  );
};

export default ProductList;