import React from "react";
import { Search } from "lucide-react";

const RoomSearchBar = ({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
}) => {
    return (
        <div className="row g-2 align-items-stretch">
            <div className="col-12 col-lg-9 position-relative">
                <Search
                    style={{
                        width: "16px",
                        height: "16px",
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6c757d",
                    }}
                />
                <input
                    type="text"
                    placeholder="Search by room number or player name"
                    className="form-control"
                    style={{ paddingLeft: "32px" }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="col-12 col-lg-3">
                <select
                    className="form-select"
                    aria-label="Filter rooms by status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All rooms</option>
                    <option value="active">Active rooms</option>
                    <option value="closed">Closed rooms</option>
                </select>
            </div>
        </div>
    );
};

export default RoomSearchBar;
