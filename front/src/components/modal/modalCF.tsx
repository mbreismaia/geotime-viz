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
  DateRangePicker,
  Slider,
  CalendarDate,
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { defaultParameters, coloring_method, dim_reduction_technique, reference_point, weekDay, depth_type } from "./modal";
import { parseDate } from "@internationalized/date";
import { toast } from "react-toastify";
import { useParameters } from "@/components/context/ParametersContext";

interface ModalCfProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalCf({ isOpen, onClose }: ModalCfProps) {
  const { parameters, setParameters } = useParameters();
  const formatDate = (date: string | undefined): CalendarDate | undefined => {
    if (!date) return undefined;
    return parseDate(date.split("T")[0]);
  };
  const [dateIntervalDB, setDateIntervalDB] = useState<{ min_date: string, max_date: string } | null>(null);


  // Carregar parâmetros ao abrir o modal
  useEffect(() => {
    const fetchDateInterval = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/date-interval");
        setDateIntervalDB(res.data);

        // Se parâmetros ainda não têm intervalo de data, setar valor inicial
        if (!parameters.date_interval && res.data.min_date && res.data.max_date) {
          setParameters((prev) => ({
            ...prev,
            date_interval: [res.data.min_date, res.data.max_date],
          }));
        }
      } catch (error) {
        console.error("Failed to fetch date interval from backend:", error);
      }
    };

    if (isOpen) {
      fetchDateInterval();

      const savedParameters = localStorage.getItem("savedParameters");
      if (savedParameters) {
        setParameters(JSON.parse(savedParameters));
      }
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      localStorage.setItem("savedParameters", JSON.stringify(parameters));
      toast.success("Data is being sent. Please wait... The page will reload automatically.");
      onClose();

      console.log("Parameters being sent:", parameters);
      const response = await axios.post("http://127.0.0.1:8000/api/compute_ed", parameters);

      if (response.status === 200) {
        toast.success("Computation was done successfully!");
      } else {
        toast.error("Failed to compute ED.");
      }
    
      window.location.reload(); 

    } catch (error) {
      console.error("Erro ao enviar os parâmetros:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} className="w-full h-4/5 bg-gray-800 ">
      <ModalContent >
        <ModalHeader className="flex flex-col gap-1 text-white">Dashboard Settings</ModalHeader>
        <ModalBody className="overflow-y-scroll">
          <DateRangePicker
            label="Select a Date Range"
            className="w-full"
            disableAnimation
            minValue={dateIntervalDB ? formatDate(dateIntervalDB.min_date) : undefined}
            maxValue={dateIntervalDB ? formatDate(dateIntervalDB.max_date) : undefined}
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
            label="Select a Depth Type"
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
