const CategoryList = ({ categories }) => {
  return (
    <div className="category-list">
      {categories.map((category) => (
        <div 
          key={category.id} 
          className="category-item"
          style={{ backgroundColor: category.color }}
        >
          <span className="category-name">{category.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryList; 