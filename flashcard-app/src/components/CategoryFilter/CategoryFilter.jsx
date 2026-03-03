import styles from './CategoryFilter.module.css';

function CategoryFilter({ categories, activeFilter, onFilterChange }) {
  const allCategories = ['All', ...categories];

  return (
    <div className={styles.filterBar} role="group" aria-label="Filter cards by category">
      {allCategories.map((cat) => (
        <button
          key={cat}
          className={`${styles.pill} ${activeFilter === cat ? styles.active : ''}`}
          onClick={() => onFilterChange(cat)}
          aria-pressed={activeFilter === cat}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
