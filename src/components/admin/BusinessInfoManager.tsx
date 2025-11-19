import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useBusinessInfo } from "@/contexts/BusinessInfoContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Save, RefreshCw } from "lucide-react"
import type { BusinessInfo } from "@/types/business-info"

export function BusinessInfoManager() {
  const { businessInfo, refetch } = useBusinessInfo()
  const [formData, setFormData] = useState<Partial<BusinessInfo>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (businessInfo) {
      setFormData(businessInfo)
    }
  }, [businessInfo])

  const handleSave = async () => {
    if (!formData.id) {
      toast.error("Business info ID is required")
      return
    }

    try {
      setIsSaving(true)

      const updateData = {
        name: formData.name,
        legal_name: formData.legalName,
        description: formData.description,
        tagline: formData.tagline,
        ceo: formData.ceo,
        location: formData.location,
        contact: formData.contact,
        hours: formData.hours,
        geo: formData.geo,
        founded_year: formData.foundedYear,
        service_areas: formData.serviceAreas,
        social_media: formData.socialMedia,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from("business_info")
        .update(updateData)
        .eq("id", formData.id)

      if (error) throw error

      toast.success("Business information updated successfully")
      await refetch()
    } catch (error) {
      console.error("Error updating business info:", error)
      toast.error("Failed to update business information")
    } finally {
      setIsSaving(false)
    }
  }

  if (!businessInfo) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Loading business information...</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Business Information</h2>
          <p className="text-muted-foreground">
            Manage your business details for consistent NAP across all pages
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 animate-spin" size={16} />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2" size={16} />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Unique Staffing Professionals Inc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="legalName">Legal Name</Label>
              <Input
                id="legalName"
                value={formData.legalName || ""}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                placeholder="Unique Staffing Professionals Inc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline || ""}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Where Opportunity Starts!"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Professional staffing agency..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ceo">CEO Name</Label>
            <Input
              id="ceo"
              value={formData.ceo || ""}
              onChange={(e) => setFormData({ ...formData, ceo: e.target.value })}
              placeholder="Otniel Morilla"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Location Information</h3>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                value={formData.location?.street || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location!, street: e.target.value }
                  })
                }
                placeholder="6200 Baltimore Avenue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="suite">Suite/Floor</Label>
              <Input
                id="suite"
                value={formData.location?.suite || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location!, suite: e.target.value }
                  })
                }
                placeholder="Floor 3, Suite R35"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.location?.city || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location!, city: e.target.value }
                  })
                }
                placeholder="Riverdale"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.location?.state || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location!, state: e.target.value }
                  })
                }
                placeholder="MD"
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={formData.location?.zipCode || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location!, zipCode: e.target.value }
                  })
                }
                placeholder="20737"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.contact?.phone || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact!, phone: e.target.value }
                  })
                }
                placeholder="+13012385182"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="textLine">Text Line</Label>
              <Input
                id="textLine"
                value={formData.contact?.textLine || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact!, textLine: e.target.value }
                  })
                }
                placeholder="+13012385183"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.contact?.email || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact!, email: e.target.value }
                  })
                }
                placeholder="info@uniquestaffingprofessionals.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fax">Fax Number</Label>
              <Input
                id="fax"
                value={formData.contact?.fax || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact!, fax: e.target.value }
                  })
                }
                placeholder="+12403923898"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Geographic Coordinates</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Used for map displays and local SEO. You can find coordinates at{" "}
          <a
            href="https://www.latlong.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            LatLong.net
          </a>
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="0.0001"
              value={formData.geo?.latitude || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  geo: { ...formData.geo!, latitude: parseFloat(e.target.value) }
                })
              }
              placeholder="38.9643"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="0.0001"
              value={formData.geo?.longitude || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  geo: { ...formData.geo!, longitude: parseFloat(e.target.value) }
                })
              }
              placeholder="-76.9283"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 animate-spin" size={16} />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="mr-2" size={16} />
              Save All Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
