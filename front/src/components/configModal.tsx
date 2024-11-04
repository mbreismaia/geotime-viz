import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Slider, DateRangePicker } from "@nextui-org/react";
import { useState } from "react";

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfigModal({ isOpen, onClose }: ConfigModalProps) {
  const [hourRange, setHourRange] = useState<[number, number]>([0, 24]);
  const [coloringMethod, setColoringMethod] = useState<string>("");
  const [dimensionalityReduction, setDimensionalityReduction] = useState<string>("");
  const [referencePoint, setReferencePoint] = useState<string>("");

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Dashboard Settings</ModalHeader>
          <ModalBody>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">Select Date Range</label>
              <DateRangePicker 
                className="w-full" 
              />
            </div>

            <div >
              <label className="text-sm font-medium mb-2">Select Hour Range</label>
              <Slider
                value={hourRange}
                onChange={(value) => {
                  if (Array.isArray(value) && value.length === 2) {
                    // Limite os valores entre 0 e 24
                    const newValue = [
                      Math.max(0, Math.min(value[0], 24)),
                      Math.max(0, Math.min(value[1], 24)),
                    ] as [number, number];
                    setHourRange(newValue);
                  }
                }}
                min={0}
                max={24}
                step={1}
                range
              />
              <div className="text-sm mt-2">
                {hourRange[0]}:00 - {hourRange[1]}:00
              </div>
            </div>

            <div >
              <label className="text-sm font-medium mb-2">Coloring Method</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={coloringMethod}
                onChange={(e) => setColoringMethod(e.target.value)}
              >
                <option value="Heatmap">Heatmap</option>
                <option value="Gradient">Gradient</option>
                <option value="Categories">Categories</option>
              </select>
            </div>

            <div >
              <label className="text-sm font-medium mb-2">Dimensionality Reduction Algorithm</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={dimensionalityReduction}
                onChange={(e) => setDimensionalityReduction(e.target.value)}
              >
                <option value="PCA">PCA</option>
                <option value="t-SNE">t-SNE</option>
                <option value="UMAP">UMAP</option>
              </select>
            </div>

            <div >
              <label className="text-sm font-medium mb-2">Reference Point</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={referencePoint}
                onChange={(e) => setReferencePoint(e.target.value)}
              >
                <option value="Center">Center</option>
                <option value="Origin">Origin</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="bordered" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={onClose}>
              Save
            </Button>
          </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
