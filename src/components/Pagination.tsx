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
  return (
    <ReactPaginate
      pageCount={pageCount > 0 ? pageCount : 1}
      pageRangeDisplayed={10}
      marginPagesDisplayed={2}
      onPageChange={handlePageChange}
      nextLabel={"Siguiente"}
      forcePage={pageCount > 0 ? currentPage - 1 : 0}
      previousLabel={"Anterior"}
      containerClassName="flex justify-center gap-2 mt-4"
      pageClassName="bg-gray-200 hover:bg-blue-500 text-gray-800 hover:text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition-all"
      activeClassName="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md cursor-pointer"
      previousClassName="bg-gray-200 hover:bg-blue-500 text-gray-800 hover:text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition-all"
      nextClassName="bg-gray-200 hover:bg-blue-500 text-gray-800 hover:text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition-all"
      disabledClassName="text-gray-400 cursor-not-allowed"
    />
  );
}
