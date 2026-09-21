const Loader = () => {
  return (
    <div className="w-full h-1/3 flex flex-col gap-gap-large bg-background Border-Top p-padding-large">
      <div className="animate-pulse flex gap-gap-small items-center">
        <div className="rounded-radius bg-blare h-12 w-12"></div>
        <div className="h-4 bg-blare rounded-radius w-1/4"></div>
      </div>
      <div className="space-y-gap-small">
        <div className="h-3 bg-blare rounded-radius w-1/3"></div>
        <div className="h-3 bg-blare rounded-radius w-1/2"></div>
        <div className="h-3 bg-blare rounded-radius w-5/6"></div>
        <div className="h-3 bg-blare rounded-radius w-2/3"></div>
      </div>
    </div>
  );
};

export default Loader;
