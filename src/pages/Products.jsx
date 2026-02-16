import "../styles/page.css";
import { FaTag, FaEdit } from "react-icons/fa";
import { FaArrowTrendUp, FaPowerOff } from "react-icons/fa6";

import { useEffect, useState } from "react";
import { useToast } from "../components/ui/Toast";

import DashboardCard from "../components/DashboardCard";
import CardTop from "../components/CardTop";
import LoadingOverlay from "../components/ui/LoadingOverlay";

import TableToolbar from "../components/TableToolbar";
import DataTable from "../components/DataTable/DataTable";
import TableFooter from "../components/TableFooter";
import { productColumns } from "../configs/productTable.config";
import {
  getProducts,
  getProductById,
  activateProduct,
} from "../services/product.service.js";

import FormModal from "../components/Modals/FormModal";
import ProductForm from "../components/Forms/ProductForm";

import AddBtn from "../components/addBtn";

function Products() {
  const { showToast } = useToast();
  // BBDD
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // PAGINATION
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 4;

  // FILTERS
  // ACTIVE/INACTIVE
  const [statusFilter, setStatusFilter] = useState("all");

  // SORTING
  // NAME && LASTNAME
  const [sort, setSort] = useState({
    field: "name",
    order: "asc",
  });

  // FETCHS
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts({
        page,
        limit,
        status: statusFilter,
        sort: sort.field,
        order: sort.order,
      });

      const mappedProducts = res.data.map((product) => ({
        id: product.id_product,
        name: product.name,
        price: product.price,
        status: product.active ? "Active" : "Inactive",
        active: product.active,
      }));

      setProducts(mappedProducts);
      setPages(res.pages);
      setTotal(res.total);
    } catch (error) {
      console.log("Error fetching products:", error);
      showToast("Error fetching products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, statusFilter, sort]);

  // ACTIONS
  // EDIT
  const openEdit = async (row) => {
    try {
      setFormMode("edit");
      const editProduct = await getProductById(row.id);
      setSelectedProduct(editProduct);
      setIsModalOpen(true);
    } catch (error) {
      console.log("Error fetching product details", error);
    }
  };

  // ACTIVATE/DEACTIVATE
  const toggleActive = async (row) => {
    try {
      const res = await activateProduct(row.id);
      showToast(res.message, "success");
      fetchProducts();
    } catch (error) {
      console.log("Error toggling product status", error);
      showToast("Error toggling product status", "error");
    }
  };

  const productsActions = (row) => {
    return (
      <div className="table-actions">
        <FaEdit
          size={20}
          className="table-actions__icon icon-edit"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation();
            openEdit(row);
          }}
        />
        <FaPowerOff
          size={20}
          className="table-actions__icon icon-delete"
          title="Activate/Deactivate"
          onClick={(e) => {
            e.stopPropagation();
            toggleActive(row);
          }}
        />
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="container-top">
        <div className="container-title">
          <h1>Products</h1>
          <h4>Manage products and their components</h4>
        </div>
        <AddBtn
          icon={FaTag}
          action="Add Product"
          description="Register a new product"
          onClick={() => {
            setFormMode("create");
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
          iconColor="#4f27ee"
          iconBgColor="#4f27ee31"
        />
      </div>
      <div className="dashboard-cards">
        <DashboardCard
          title="Total products"
          icon={FaTag}
          iconBgColor="#00c24e"
          data="1"
          stats={3}
        />
        <DashboardCard
          title="Total products"
          icon={FaTag}
          iconBgColor="#6C89FF"
          data="182"
          stats={-3}
        />
        <CardTop
          title="Most purchased products"
          icon={FaArrowTrendUp}
          iconBgColor="#f38744"
        />
      </div>

      <div className="table-container">
        <LoadingOverlay visible={loading} text="Loading products..." />
        <TableToolbar
          placeholder="Search by name or category"
          filters={[
            {
              key: "status",
              type: "select",
              value: statusFilter,
              onChange: (value) => {
                setPage(1);
                setStatusFilter(value);
              },
              options: [
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ],
            },
          ]}
          onSort={() => {
            setPage(1);
            setSort((prev) => ({
              field: "name",
              order: prev.order === "asc" ? "desc" : "asc",
            }));
          }}
          sortOrder={sort.order}
        />
        <DataTable
          columns={productColumns}
          data={products}
          onRowClick={(row) => openPreview(row.original ?? row)}
          actions={productsActions}
        />
        <TableFooter
          page={page}
          pages={pages}
          total={total}
          onPageChange={setPage}
        />
      </div>
      <FormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formMode === "create" ? "Create Product" : "Edit Product"}
      >
        <ProductForm
          mode={formMode}
          initialData={selectedProduct}
          onClose={() => setIsModalOpen(false)}
          onSuccess={async () => {
            setIsModalOpen(false);
            await fetchProducts();
          }}
        />
      </FormModal>
    </div>
  );
}

export default Products;
