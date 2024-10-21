import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, DateRangePicker, Slider } from "@nextui-org/react";

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfigModal({ isOpen, onClose }: ConfigModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">Dashboard Settings</ModalHeader>
          <ModalBody>
            <div>
              <label className="font-medium">Select Date Range</label>
              <DateRangePicker className="w-full" />
            </div>

            <div>
              <Slider
                label="Hour Interval"
                step={1}
                minValue={0}
                maxValue={24}
                defaultValue={[8, 17]}
                formatOptions={{ style: "unit", unit: "hour" }}
                className="max-w-md"
              />
            </div>

            <div>
              <label className="font-medium">Coloring Method</label>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option value="default">Default</option>
                <option value="gradient">Gradient</option>
                <option value="category">Category</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Dimensionality Reduction Algorithm</label>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option value="PCA">PCA</option>
                <option value="t-SNE">t-SNE</option>
                <option value="UMAP">UMAP</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Reference Point</label>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option value="Center">Center</option>
                <option value="Origin">Origin</option>
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
        </>
      </ModalContent>
    </Modal>
  );
}
