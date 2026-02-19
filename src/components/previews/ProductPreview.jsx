import "./preview.css";
import { useState, useEffect, useRef } from "react";
import { IoIosCloseCircle, IoIosAddCircle } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";

import { useToast } from "../ui/Toast.jsx";
import ConfirmPopup from "../Modals/ConfirmPopup.jsx";

import AddBtn from "../addBtn";
import LoadingOverlay from "../ui/LoadingOverlay.jsx";

import { getProductById } from "../../services/product.service";
import TableToolbar from "../TableToolbar";
import DataTable from "../DataTable/DataTable";
import TableFooter from "../TableFooter";
import { productComponentColumns } from "../../configs/productComponentTable.config.jsx";
import {
  getProductComponentsByProductId,
  getProductComponentById,
  deleteProductComponent,
} from "../../services/productComponent.service.js";

import FormModal from "../Modals/FormModal.jsx";
import ProductComponentForm from "../Forms/ProductComponentForm.jsx";

function ProductPreview({ productId, onClose }) {
  const { showToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);

  const [closing, setClosing] = useState(false);
  const asideRef = useRef(null);

  // STATES
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productComponents, setProductComponents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedComponent, setSelectedComponent] = useState(null);

  // TABLE
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState({ field: "name", order: "asc" });

  // FETCH
  // PRODUCT
  const fetchProduct = async () => {
    try {
      const data = await getProductById(productId);
      setProduct(data);
    } catch (error) {
      showToast("Error loading product", "error");
    }
  };

  useEffect(() => {
    if (!productId) return;

    setProduct(null);
    fetchProduct();
  }, [productId]);

  // PRODUCT COMPONENTS
  const fetchProductComponents = async () => {
    try {
      const res = await getProductComponentsByProductId(productId);

      const mappedComponents = res.data.map((c) => ({
        id: `${c.id_product}-${c.id_component}`,
        id_product: c.id_product,
        id_component: c.id_component,
        name: c.component?.name ?? "-",
        supplier: c.component?.supplier?.name ?? "-",
        quantity: c.quantity,
      }));

      setProductComponents(mappedComponents);
    } catch (error) {
      console.log(error);

      showToast("Error loading product components", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!productId) return;

    setProductComponents([]);
    fetchProductComponents();
  }, [productId]);

  if (!productId) return null;

  // ACTIONS

  // EDIT
  const openEdit = async (row) => {
    try {
      setFormMode("edit");
      const productComponent = await getProductComponentById(
        row.id_product,
        row.id_component,
      );
      setSelectedComponent(productComponent);
      setIsModalOpen(true);
    } catch (error) {
      console.log("Error fetching product component", error);
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (!componentToDelete) return;

    try {
      await deleteProductComponent(
        componentToDelete.id_product,
        componentToDelete.id_component,
      );

      showToast("Product component deleted successfully", "success");

      await fetchProductComponents();
    } catch (error) {
      showToast("Error deleting component", "error");
    } finally {
      setShowConfirm(false);
      setComponentToDelete(null);
    }
  };

  const handleClose = () => {
    setClosing(true);
  };

  useEffect(() => {
    if (!closing) return;
    const aside = asideRef.current;
    if (!aside) return;
    const handleAnimationEnd = () => {
      onClose();
    };
    aside.addEventListener("animationend", handleAnimationEnd);
    return () => aside.removeEventListener("animationend", handleAnimationEnd);
  }, [closing, onClose]);

  const productComponentActions = (row) => {
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
        <FaTrash
          size={20}
          className="table-actions__icon icon-delete"
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            setComponentToDelete(row);
            setShowConfirm(true);
          }}
        />
      </div>
    );
  };

  return (
    <div className="preview-overlay" onClick={handleClose}>
      <aside
        ref={asideRef}
        className={`preview${closing ? " slide-out" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ConfirmPopup
          open={showConfirm}
          title="Confirm Deletion"
          message="The product component will be permanently deleted. Are you sure?"
          onConfirm={handleDelete}
          onCancel={() => {
            setShowConfirm(false);
          }}
          confirmText="Delete"
          cancelText="Cancel"
        />
        <div className="preview__header">
          <h2>{product?.name}</h2>
        </div>
        <div className="preview__header-info">
          <div className="order-info">
            <div>
              <strong>Product ID:</strong> {productId}
            </div>
            <div>
              <strong>Price:</strong> {product?.price} €
            </div>
            <div>
              <strong>Description:</strong> {product?.description}
            </div>
            <div>
              <strong>Components Required:</strong>{" "}
              {product?.components?.length ?? 0}
            </div>
          </div>
          <div className="preview__header-actions">
            <AddBtn
              icon={IoIosAddCircle}
              action="Add Component"
              description="Add new component"
              onClick={() => {
                setFormMode("create");
                setSelectedComponent(null);
                setIsModalOpen(true);
                console.log("Create Product Component");
              }}
              iconColor="#4f27ee"
              iconBgColor="#4f27ee31"
            />
          </div>
        </div>
        <div className="table-container">
          <LoadingOverlay
            visible={loading}
            text="Loading product components..."
          />
          <TableToolbar
            placeholder="Search by name"
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
            columns={productComponentColumns}
            data={productComponents}
            onRowClick={(row) => console.log(row)}
            actions={productComponentActions}
          />

          <TableFooter
            page={1}
            totalPages={1}
            total={productComponents.length}
            onPageChange={() => {}}
          />
        </div>

        <button className="close-btn" onClick={handleClose}>
          <IoIosCloseCircle size={50} />
        </button>
      </aside>
      <div onClick={(e) => e.stopPropagation()}>
        <FormModal
          open={isModalOpen}
          onClose={async () => {
            setIsModalOpen(false);
            await fetchProduct();
          }}
          title={
            formMode === "create"
              ? "Create Product-Component"
              : "Edit Product-Component"
          }
        >
          <ProductComponentForm
            mode={formMode}
            initialData={selectedComponent}
            productId={productId}
            onClose={() => {
              setIsModalOpen(false);
            }}
            onSuccess={async () => {
              setIsModalOpen(false);
              await fetchProduct();
              await fetchProductComponents();
            }}
          />
        </FormModal>
      </div>
    </div>
  );
}

export default ProductPreview;
