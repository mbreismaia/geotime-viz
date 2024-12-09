"use client";

import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem, DateRangePicker, Slider, CalendarDate, Spinner } from "@nextui-org/react";
import axios from "axios";
import { parseDate } from "@internationalized/date";
import { defaultParameters, coloring_method, dim_reduction_technique, reference_point, weekDay, depth_type } from "./modal";

interface ModalCfProps {
  isOpen: boolean;
  onClose: () => void;
  selectedZones: string[];
  setPlotData: (data: any) => void;
}

export default function ModalCf({ isOpen, onClose, selectedZones, setPlotData }: ModalCfProps) {
  const [parameters, setParameters] = useState(defaultParameters);
  const [loading, setLoading] = useState(false); 
  const formatDate = (date: string): CalendarDate => parseDate(date);

  useEffect(() => {
    if (isOpen) {
      const savedParameters = localStorage.getItem("savedParameters");
      if (savedParameters) {
        setParameters(JSON.parse(savedParameters));
      } else {
        setParameters((prev) => ({
          ...prev,
          zones: selectedZones,
        }));
      }
    }
  }, [isOpen, selectedZones]);

  const handleSave = async () => {
    try {
      setLoading(true);

      const requestData = { ...parameters, zones: selectedZones };
      console.log("Parâmetros enviados:", requestData);

      localStorage.setItem("savedParameters", JSON.stringify(parameters));

      const response = await axios.post("http://127.0.0.1:8000/api/line_plot", requestData);
      console.log("PLOT DATA AQUI:", response.data);

      setPlotData(response.data);
      localStorage.setItem("plotData", JSON.stringify(response.data));

      setLoading(false);
      onClose();

      window.location.reload(); 
    } catch (error) {
      console.error("Erro ao enviar os parâmetros:", error);
      setLoading(false); 
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} className="bg-slate-900">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-white">Settings</ModalHeader>
        <ModalBody>
          {loading ? (
            <div className="flex justify-center items-center">
              <Spinner size="lg" />
              <span className="ml-2 text-white">Processing...</span>
            </div>
          ) : (
            <>
              <DateRangePicker
                label="Select a Date Range"
                className="w-full"
                value={
                  parameters.date_interval
                    ? {
                        start: formatDate(parameters.date_interval[0]),
                        end: formatDate(parameters.date_interval[1]),
                      }
                    : undefined
                }
                onChange={(value) => {
                  if (value && "start" in value && "end" in value) {
                    setParameters((prev) => ({
                      ...prev,
                      date_interval: [
                        value.start.toString(),
                        value.end.toString(),
                      ],
                    }));
                  }
                }}
              />
              <Select
                label="Filter by Day"
                selectionMode="multiple"
                selectedKeys={new Set(parameters.days_of_week)}
                className="w-full"
                onSelectionChange={(keys) =>
                  setParameters((prev) => ({
                    ...prev,
                    days_of_week: Array.from(keys) as string[],
                  }))
                }
              >
                {weekDay.map((day) => (
                  <SelectItem key={day.key}>{day.label}</SelectItem>
                ))}
              </Select>
              <Slider
                label="Time Range"
                step={1}
                minValue={0}
                maxValue={23}
                value={parameters.hour_interval}
                onChange={(value) =>
                  setParameters((prev) => ({
                    ...prev,
                    hour_interval: value as [number, number],
                  }))
                }
                formatOptions={{ style: "unit", unit: "hour" }}
                className="max-w-md text-white"
              />
              <Select
                label="Select a Color Method"
                className="w-full"
                value={parameters.coloring_method}
                onChange={(e) =>
                  setParameters((prev) => ({
                    ...prev,
                    coloring_method: e.target.value,
                  }))
                }
              >
                {coloring_method.map((color) => (
                  <SelectItem key={color.key} value={color.key}>
                    {color.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Select a Depth Method"
                className="w-full"
                value={parameters.depth_type}
                onChange={(e) =>
                  setParameters((prev) => ({
                    ...prev,
                    depth_type: e.target.value,
                  }))
                }
              >
                {depth_type.map((depth) => (
                  <SelectItem key={depth.key} value={depth.key}>
                    {depth.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Select a Dimensionality Reduction"
                className="w-full"
                value={parameters.dim_reduction_technique}
                onChange={(e) =>
                  setParameters((prev) => ({
                    ...prev,
                    dim_reduction_technique: e.target.value,
                  }))
                }
              >
                {dim_reduction_technique.map((dimension) => (
                  <SelectItem key={dimension.key} value={dimension.key}>
                    {dimension.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Select a Reference Point"
                className="w-full"
                value={parameters.reference_point}
                onChange={(e) =>
                  setParameters((prev) => ({
                    ...prev,
                    reference_point: e.target.value,
                  }))
                }
              >
                {reference_point.map((point) => (
                  <SelectItem key={point.key} value={point.key}>
                    {point.label}
                  </SelectItem>
                ))}
              </Select>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="bordered" onPress={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
