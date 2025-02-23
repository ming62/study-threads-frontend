import React from 'react';

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'Arts':
        return 'bg-primary';
      case 'Business':
        return 'bg-success';
      case 'Computing':
        return 'bg-info';
      case 'Engineering':
        return 'bg-warning';
      case 'Law':
        return 'bg-danger';
      case 'Medicine':
        return 'bg-secondary';
      case 'Music':
        return 'bg-dark';
      case 'Science':
        return 'bg-light text-dark';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <span className={`badge ${getBadgeColor(category)} me-1`}>
      {category}
    </span>
  );
};

export default CategoryBadge;