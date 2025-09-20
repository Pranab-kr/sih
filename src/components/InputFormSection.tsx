import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Label } from './ui/label';

export function InputFormSection() {
  return (
    <Card className="bg-neutral-50 border-neutral-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-neutral-800">Impact Assessment Parameters</CardTitle>
        <CardDescription className="text-neutral-600">
          Configure your material and process parameters to calculate environmental impact
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-neutral-700">Material Type</Label>
            <Select>
              <SelectTrigger className="bg-white border-neutral-200">
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aluminum">Aluminum</SelectItem>
                <SelectItem value="steel">Steel</SelectItem>
                <SelectItem value="plastic">Plastic (PET)</SelectItem>
                <SelectItem value="glass">Glass</SelectItem>
                <SelectItem value="paper">Paper</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-neutral-700">Process Route</Label>
            <Select>
              <SelectTrigger className="bg-white border-neutral-200">
                <SelectValue placeholder="Select process" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary Production</SelectItem>
                <SelectItem value="recycled">Recycled Content</SelectItem>
                <SelectItem value="hybrid">Hybrid Process</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-neutral-700">Energy Source</Label>
            <Select>
              <SelectTrigger className="bg-white border-neutral-200">
                <SelectValue placeholder="Select energy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="renewable">Renewable</SelectItem>
                <SelectItem value="grid-mix">Grid Mix</SelectItem>
                <SelectItem value="fossil">Fossil Fuels</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-neutral-700">Local Transport</Label>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-neutral-700">Carbon Offset</Label>
              <Switch />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-neutral-700">Production Volume (tons)</Label>
              <Slider
                defaultValue={[1000]}
                max={10000}
                min={100}
                step={100}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-neutral-500">
                <span>100</span>
                <span>1,000</span>
                <span>10,000</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}