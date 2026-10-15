const Card = ({ product }) => {

    const { title, price, image, description } = product;
    
    return (
        <div className="
          w-80
          text-text-inverse
          dark:bg-neutral-950/70
          backdrop-blur-[2px]
          shadow-lg
          rounded-2xl
          overflow-hidden
          hover:shadow-black
          transition-shadow
          duration-700
        ">
            <img 
              src={image}
              alt={title}
              className="w-full h-48 object-contain bg-gray-100"
            />

            <div className="p-5 space-y-3">
                <h2 className="text-xl font-semibold">
                    {title}
                </h2>

                <p className="text-sm">
                    {description}
                </p>

                <p className="text-lg font-bold text-cyan-200">
                    {/* esto agrega separadores de miles, lo que mejora la lectura, String() */}
                    {price.toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default Card;