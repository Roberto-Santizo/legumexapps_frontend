import ReactPaginate from "react-paginate";

type Props = {
  pageCount: number;
  currentPage: number;
  handlePageChange: (selectedItem: { selected: number }) => void;
};

export default function Pagination({
  pageCount,
  handlePageChange,
  currentPage,
}: Props) {
  const isPageCountValid = pageCount > 0;

  return (
    <ReactPaginate
      pageCount={isPageCountValid ? pageCount : 1}
      pageRangeDisplayed={window.innerWidth < 640 ? 1 : 3}
      marginPagesDisplayed={window.innerWidth < 640 ? 1 : 2}
      onPageChange={handlePageChange}
      nextLabel="Siguiente"
      previousLabel="Anterior"
      forcePage={isPageCountValid ? currentPage - 1 : 0}
      containerClassName="flex flex-wrap justify-center gap-2 mt-4"
      pageClassName="bg-gray-200 hover:bg-blue-500 text-gray-800 hover:text-white font-semibold py-2 px-3 sm:px-4 text-sm sm:text-base rounded-md cursor-pointer transition-all"
      activeClassName="bg-indigo-500 text-white font-semibold py-2 px-3 sm:px-4 rounded-md cursor-pointer"
      previousClassName="bg-gray-200 hover:bg-blue-500 text-gray-800 hover:text-white font-semibold py-2 px-3 sm:px-4 text-sm sm:text-base rounded-md cursor-pointer transition-all"
      nextClassName="bg-gray-200 hover:bg-blue-500 text-gray-800 hover:text-white font-semibold py-2 px-3 sm:px-4 text-sm sm:text-base rounded-md cursor-pointer transition-all"
      disabledClassName="text-gray-400 cursor-not-allowed"
    />
  );
}
