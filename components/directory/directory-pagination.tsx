export function DirectoryPagination({ page, total }: { page: number; total: number }) {
  return (
    <div className="flex justify-center mt-8">
      <nav>Page {page} sur {Math.ceil(total / 20)}</nav>
    </div>
  )
}
