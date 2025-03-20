const CategoryCard = ({ title, count, color, onClick }) => {
  return (
    <div 
      className="category-card" 
      style={{ backgroundColor: color }} 
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold">
        {title}
      </h3>
    </div>
  );
};

export default CategoryCard; 