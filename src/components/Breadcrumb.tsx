
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

interface BreadcrumbProps {
  items: {
    label: string;
    href: string;
  }[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="flex items-center gap-2 text-sm mb-4">
      <Link to="/" className="flex items-center text-logistics-blue hover:text-logistics-blue-hover">
        <Home size={16} className="mr-1" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          <span className="text-gray-400">/</span>
          <Link 
            to={item.href} 
            className={`${index === items.length - 1 ? 'text-gray-600' : 'text-logistics-blue hover:text-logistics-blue-hover'}`}
          >
            {item.label}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
