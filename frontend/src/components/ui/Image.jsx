const Image = ({ src, alt, width, height, onClick, className, ...props}) => {
    return (
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" fetchPriority="low" onClick={onClick} className={className} {...props} />
    );
};

export default Image;