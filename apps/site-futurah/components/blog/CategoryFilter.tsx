'use client'

interface CategoryFilterProps {
    categories: { name: string; slug: string }[]
    activeCategory: string
    onCategoryChange: (slug: string) => void
}

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
    return (
        <div className="flex flex-col space-y-6">
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                Filtrar por categorias
            </h2>
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => onCategoryChange('all')}
                    className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 border ${activeCategory === 'all'
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-white border-white/20 hover:border-white/50'
                        }`}
                >
                    Tudo
                </button>
                {categories.map((category) => (
                    <button
                        key={category.slug}
                        onClick={() => onCategoryChange(category.slug)}
                        className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 border ${activeCategory === category.slug
                                ? 'bg-white text-black border-white'
                                : 'bg-transparent text-white border-white/20 hover:border-white/50'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    )
}
