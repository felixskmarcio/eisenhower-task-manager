const CategoryCard = ({ title, count, color, onClick }) => {
  return (
    <div 
      className="category-card" 
      style={{ backgroundColor: color }} 
      onClick={onClick}
    >
      <span className="category-title">{title}</span>
    </div>
  );
};

export default CategoryCard; 