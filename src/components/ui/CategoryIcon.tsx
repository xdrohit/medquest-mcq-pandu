import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className }) => {
  // Dynamically resolve icon name from Lucide-React
  const IconComponent = (Icons as any)[name] || Icons.BookOpen;
  return <IconComponent className={className} />;
};
