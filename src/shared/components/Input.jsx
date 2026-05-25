export default function Input({
    label,
    htmlFor,
    type= "text",
    ...props
}){


    return(
        <div>

            {/* Label */}
            <label 
                htmlFor={htmlFor}
                className="
                    block
                    text-caption
                    mb-1
                    text-secondary
                "
                >
                {label}
            </label>

            {/* Contenedor de input */}
            <div
                className="
                    relativo
                    h-10
                    flex
                    items-center
                "
                
                >
                    {/* Área interactiva invisible (48px) */}
                <div
                    className="
                        absolute 
                        inset-0
                    "
                    onMouseDown={(e)=>{
                        e.preventDefault();
                        e.currentTarget.nextSibling();
                    }}
                    />
                    
                    {/* Input visual */}
                    <input
                        type={type}
                        className="
                        relative
                        w-full
                        h-10
                        rounded-md
                        border-border-black
                        px-4
                        text-body

                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary
                        "
                        {...props}

                        
                    />

                  </div>



        </div>
    )
}