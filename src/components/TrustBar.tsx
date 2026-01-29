export default function TrustBar() {
  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 mb-8 tracking-wide uppercase">
          Trusted by teams at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          <span className="text-gray-400 font-medium text-lg">
            Federal Agencies
          </span>
          <span className="hidden md:block w-px h-6 bg-gray-300" />
          <span className="text-gray-400 font-medium text-lg">
            Healthcare Organizations
          </span>
          <span className="hidden md:block w-px h-6 bg-gray-300" />
          <span className="text-gray-400 font-medium text-lg">
            Fortune 500
          </span>
        </div>
      </div>
    </section>
  );
}
