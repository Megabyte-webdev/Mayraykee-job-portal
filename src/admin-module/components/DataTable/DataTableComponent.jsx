import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import {
  FaCheck,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { RiFilterOffLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { BiPencil, BiTrash } from "react-icons/bi";
import { Dialog } from "primereact/dialog";
import UseAdminManagement from "../../../hooks/useAdminManagement";
import { toast } from "react-toastify";
import { Dropdown } from "primereact/dropdown";

const DataTableComponent = ({ data, name, heading, isLoading }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [editDialog, setEditDialog] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const { loading, updateStatus } = UseAdminManagement();
  const [dataState, setDataState] = useState(null);

  useEffect(() => {
    if (data) {
      setDataState(data);
    }
  }, [data]);

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const clearFilter = () => {
    setGlobalFilterValue("");
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <Button
          type="button"
          icon={<RiFilterOffLine className="mr-3" />}
          label="Clear"
          outlined
          onClick={clearFilter}
          className="w-full sm:w-auto"
        />
        <span className="p-input-icon-left w-full sm:w-auto">
          <FaSearch className="ml-2 text-gray-500" />
          <InputText
            value={globalFilterValue}
            className="pl-8 w-full sm:w-auto"
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const editData = async (e, rowData) => {
    e.stopPropagation();
    setEditDialog(true);
    setSelectedData(rowData);
  };

  const onStatusChange = (e) => {
    const val = e.value.code;
    let _selectedData = { ...selectedData };
    _selectedData.status = val;
    setSelectedData(_selectedData);
  };

  const updateSelectedData = async () => {
    if (!selectedData) {
      console.error("selectedData is null or undefined");
      toast.error("An error occurred. Please try again");
      return;
    }

    const formData = new FormData();
    formData.append("id", selectedData.id);
    formData.append("status", selectedData.status);
    if (name === "domestic-staff" || name === "artisan") {
      formData.append("type", "staff");
    } else {
      formData.append("type", name);
    }

    toast.promise(
      updateStatus(formData)
        .then((res) => {
          if (res.status === 200) {
            setEditDialog(false);
            setDataState(
              dataState.map((d) =>
                d.id === selectedData.id ? selectedData : d
              )
            );
            return Promise.resolve();
          } else {
            return Promise.reject();
          }
        })
        .catch(() => {
          return Promise.reject();
        }),
      {
        pending: "Updating status...",
        success: "Status updated successfully",
        error: "An error occurred while updating status",
      }
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex justify-center">
        <Button
          type="button"
          icon={<BiPencil className="mr-2 text-lg" />}
          outlined
          className="mr-2"
          onClick={(e) => editData(e, rowData)}
        />
        <button
          type="button"
          className="bg-green-500 px-4 py-2 text-white"
          onClick={() => handleViewDetails(rowData)}
        >View</button>
      </div>
    );
  };

  const handleViewDetails = (rowData) => {
    const id = name === "domestic-staff" && rowData.staffid ? rowData.staffid : rowData.id;
    navigate(`/admin/${name}/details/${id}`);
  };

  const editDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon={<FaTimes className="mr-2" />}
        outlined
        onClick={() => setEditDialog(false)}
      />
      <Button
        label="Save"
        loading={loading}
        icon={<FaCheck className="mr-2" />}
        onClick={updateSelectedData}
      />
    </>
  );

  const header = renderHeader();

  const navigate = useNavigate();

  const htmlBodyTemplate = (rowData) => {
    return <div dangerouslySetInnerHTML={{ __html: rowData.profile }} />;
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <span className={`bg-gray-500 text-white px-3 py-1 rounded-lg`}>
        {rowData.status}
      </span>
    );
  };

  const statuses = [
    { status: "Pending", code: "pending" },
    { status: "Approved", code: "approved" },
    { status: "Rejected", code: "rejected" },
    { status: "Suspended", code: "suspended" },
  ];

  return (
    <>
      <div className="mt-16">
        <DataTable
          value={dataState}
          rows={10}
          paginator
          removableSort
          loading={isLoading}
          dataKey="id"
          header={header}
          globalFilter={globalFilterValue}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          rowsPerPageOptions={[5, 10, 20, 50]}
          rowClassName="cursor-pointer"
          className="w-full sm:w-auto"
        >
          {heading?.map(
            (head, index) =>
              head.toLowerCase() !== "staffid" && (
                <Column
                  key={index}
                  field={head.toLowerCase()}
                  sortable
                  header={head}
                  filter
                  filterPlaceholder={`Search ${head}`}
                  body={
                    head.toLowerCase() === "profile"
                      ? htmlBodyTemplate
                      : head.toLowerCase() === "status"
                      ? statusBodyTemplate
                      : null
                  }
                />
              )
          )}
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ width: "10em" }}
          />
        </DataTable>
      </div>

      {/*Edit Dialog */}
      <Dialog
        maximizable
        visible={editDialog}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={
          name === "employer"
            ? "Change Status"
            : name === "artisan"
            ? "Edit Artisan"
            : "Edit Domestic Staff"
        }
        modal
        className="p-fluid overflow-y-auto"
        footer={editDialogFooter}
        onHide={() => setEditDialog(false)}
      >
        {selectedData && (
          <Dropdown
            optionLabel="status"
            value={
              statuses.find((status) => status.code === selectedData.status) ||
              ""
            }
            options={statuses}
            onChange={onStatusChange}
            placeholder="Select Status"
            highlightOnSelect={true}
            className="!w-full"
          />
        )}
      </Dialog>
    </>
  );
};

export default DataTableComponent;