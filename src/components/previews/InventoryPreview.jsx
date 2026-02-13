import "./preview.css";
import { useEffect, useState, useRef, use } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { FaEye, FaEdit } from "react-icons/fa";
import { useToast } from "../ui/Toast";

import AddBtn from "../addBtn.jsx";
import FormModal from "../Modals/FormModal.jsx";
import InventoryForm from "../Forms/InventoryForm.jsx";

import LoadingOverlay from "../ui/LoadingOverlay";

import TableToolbar from "../TableToolbar.jsx";
import DataTable from "../DataTable/DataTable.jsx";
import TableFooter from "../TableFooter.jsx";
import { inventoryColumns } from "../../configs/inventoryTable.config.jsx";

import {
  getWarehouseById,
  getInventoryByWarehouseId,
} from "../../services/warehouse.service.js";
import { getInventoryById } from "../../services/inventory.service.js";

function InventoryPreview({ id_warehouse, onClose }) {
  const { showToast } = useToast();
  // STATES
  const [warehouse, setWarehouse] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [totalComponents, setTotalComponents] = useState(0);
  const [stockStatus, setStockStatus] = useState("");
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!warehouse) return;

    // if (totalComponents === 0) {
    //   setStockStatus("Empty");
    // } else
    if (totalComponents < warehouse.capacity * 0.5) {
      setStockStatus("Low");
    } else if (totalComponents < warehouse.capacity * 0.8) {
      setStockStatus("Medium");
    } else {
      setStockStatus("High");
    }
  }, [totalComponents, warehouse]);

  const [loading, setLoading] = useState(true);

  // TABLE
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 5;

  const [sort, setSort] = useState({
    field: "component.name",
    order: "asc",
  });

  // FETCHS
  const fetchWarehouse = async () => {
    try {
      setLoading(true);
      const res = await getWarehouseById(id_warehouse);
      setWarehouse(res);
    } catch (error) {
      console.log("Error loading warehouse", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id_warehouse) return;
    fetchWarehouse();
  }, [id_warehouse]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await getInventoryByWarehouseId(id_warehouse, {
        page,
        limit,
        sort: sort.field,
        order: sort.order,
      });

      const mappedInventory = res.data.map((i) => ({
        id: `${i.id_component}-${i.id_warehouse}`,
        id_component: i.id_component,
        id_warehouse: i.id_warehouse,
        component: i.component?.name ?? "-",
        current_stock: i.current_stock,
        min_stock: i.min_stock,
        max_stock: i.max_stock,
        last_updated: i.last_updated,
      }));

      setInventory(mappedInventory);
      console.log(mappedInventory);

      setPages(res.pages);
      setTotalComponents(res.total);
    } catch (error) {
      console.log("Error loading inventory", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id_warehouse) return;
    fetchInventory();
  }, [id_warehouse, page, sort]);

  // ACTIONS
  const [closing, setClosing] = useState(false);
  const asideRef = useRef(null);

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

  // TABLE ACTIONS
  // EDIT
  const openEdit = async (row) => {
    try {
      const componentInventory = await getInventoryById(
        row.id_component,
        row.id_warehouse,
      );
      setSelectedInventory(componentInventory);
      setIsModalOpen(true);
    } catch (error) {
      showToast("Error loading warehouse details", "error");
    }
  };

  const inventoryActions = (row) => {
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
        <div className="preview__header">
          <h2>{warehouse?.name} - Inventory</h2>
        </div>

        <div className="preview__header-info">
          <h4 className={`capacity-info ${stockStatus.toLowerCase()}-capacity`}>
            Capacity Usage: {totalComponents} / {warehouse?.capacity}
          </h4>
          <div className="preview__header-actions">
            <AddBtn
              icon={FaEye}
              action="View Movements"
              description="Inventory movements"
              onClick={() => {
                showToast("Feature not implemented yet", "info");
              }}
              iconColor="#20C598"
              iconBgColor="#20c59947"
            />
          </div>
        </div>

        <div className="table-container">
          <LoadingOverlay visible={loading} text="Loading inventory..." />
          <TableToolbar
            placeholder="Search by name"
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
            columns={inventoryColumns}
            data={inventory}
            onRowClick={(row) => {
              console.log(row);
            }}
            actions={inventoryActions}
          />
          <TableFooter
            page={page}
            pages={pages}
            total={inventory.length}
            onPageChange={setPage}
          />
        </div>

        <button className="close-btn" onClick={handleClose}>
          <IoIosCloseCircle size={50} />
        </button>
      </aside>

      <FormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Edit Inventory"}
      >
        <InventoryForm
          mode={"edit"}
          initialData={selectedInventory}
          onClose={() => setIsModalOpen(false)}
          onSuccess={async () => {
            setIsModalOpen(false);
            await fetchInventory();
          }}
        />
      </FormModal>
    </div>
  );
}

export default InventoryPreview;
