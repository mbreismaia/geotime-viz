"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  DateValue,
  DateRangePicker,
  Slider,
} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import { coloring_method, dim_reduction_technique, reference_point, weekDay } from "./modal";

interface ModalCfProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalCf({ isOpen, onClose }: ModalCfProps) {
  const [parameters, setParameters] = useState({
    plot: "line", 
    runED: false,  
    variables: ["values", "prices", "distances", "total_time"], // Variáveis fixas
    hour_interval: [0, 24],
    date_interval: null as [string, string] | null,
    coloring_method: "",
    depth_type: "L2", 
    dim_reduction_technique: "",
    reference_point: "",
    days_of_week: [] as string[],
  });

  const formatDate = (date: DateValue) => {
    return new Date(date.toString()).toISOString().split("T")[0];
  };

 const handleSave = async () => {
  try {
    console.log("Parâmetros enviados:", parameters);  
    
    const response = await axios.post("http://127.0.0.1:8000/api/line_plot", parameters);
    
    localStorage.setItem("plotData", JSON.stringify(response.data));

    // console.log("Resposta do backend:", response.data);
    
    onClose();
  } catch (error) {
    console.error("Erro ao enviar os parâmetros:", error);
  }
};


  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} className="bg-slate-900">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-white">Dashboard Settings</ModalHeader>
        <ModalBody>
          <DateRangePicker
            label="Select a Date Range"
            className="w-full"
            onChange={(value) => {
              if (value && "start" in value && "end" in value) {
                setParameters((prev) => ({
                  ...prev,
                  date_interval: [formatDate(value.start), formatDate(value.end)],
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
            maxValue={24}
            value={parameters.hour_interval}
            onChange={(value) => setParameters((prev) => ({
              ...prev,
              hour_interval: value as [number, number], 
            }))}
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
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="bordered" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
