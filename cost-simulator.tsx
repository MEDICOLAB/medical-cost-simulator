"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

export default function Component() {
  const [monthlyTests, setMonthlyTests] = useState<number>(10)
  const [yearlyTests, setYearlyTests] = useState<number>(120)
  const [isInsuranceCovered, setIsInsuranceCovered] = useState<boolean>(false)
  const [hospitalType, setHospitalType] = useState<"with-gamma" | "mri-only">("with-gamma")

  // DaTscan costs (per test in yen)
  const datScanRevenue = 86000
  const datScanCosts = {
    reagents: 58000,
    staff: 53000, // 2 technicians × 3.5 hours
    gammaCamera: 22000, // 11,000 depreciation + 11,000 maintenance
    operations: 2000,
    other: 1000,
  }
  const datScanTotalCost = Object.values(datScanCosts).reduce((a, b) => a + b, 0)
  const datScanLossPerTest = datScanTotalCost - datScanRevenue // 49,000 yen loss

  // MRI-based solution
  const mriPreInsurance = {
    revenue: 18000,
    companyFee: 12000,
    hospitalProfit: 6000,
    netBenefit: 55000,
  }

  const mriPostInsurance = {
    revenue: 40000, // 4,000 points
    companyFee: 20000,
    hospitalProfit: 20000,
    netBenefit: 70000,
  }

  const currentSolution = isInsuranceCovered ? mriPostInsurance : mriPreInsurance

  useEffect(() => {
    setYearlyTests(monthlyTests * 12)
  }, [monthlyTests])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const monthlyBenefit = currentSolution.netBenefit * monthlyTests
  const yearlyBenefit = currentSolution.netBenefit * yearlyTests

  const totalMonthlyBenefit =
    hospitalType === "with-gamma" ? monthlyBenefit + datScanLossPerTest * monthlyTests : monthlyBenefit

  const totalYearlyBenefit =
    hospitalType === "with-gamma" ? yearlyBenefit + datScanLossPerTest * yearlyTests : yearlyBenefit

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">パーキンソン病検査 経済効果シミュレーター</h1>
        <p className="text-gray-600">DaTscanからMRI診断への切り替えによる経済メリットを算出</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              検査条件設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthly-tests">月間DaTscan検査数</Label>
              <Input
                id="monthly-tests"
                type="number"
                value={monthlyTests}
                onChange={(e) => setMonthlyTests(Number(e.target.value))}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>年間検査数（自動計算）</Label>
              <div className="text-2xl font-bold text-blue-600">{yearlyTests}回</div>
            </div>

            <div className="space-y-3">
              <Label>保険償還状況</Label>
              <div className="flex gap-2">
                <Button
                  variant={!isInsuranceCovered ? "default" : "outline"}
                  onClick={() => setIsInsuranceCovered(false)}
                  className="flex-1"
                >
                  償還前
                </Button>
                <Button
                  variant={isInsuranceCovered ? "default" : "outline"}
                  onClick={() => setIsInsuranceCovered(true)}
                  className="flex-1"
                >
                  償還後
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>病院設備状況</Label>
              <div className="space-y-2">
                <Button
                  variant={hospitalType === "with-gamma" ? "default" : "outline"}
                  onClick={() => setHospitalType("with-gamma")}
                  className="w-full justify-start"
                >
                  <div className="text-left">
                    <div className="font-medium">ガンマカメラ + MRI</div>
                    <div className="text-xs opacity-70">中規模・大規模病院</div>
                  </div>
                </Button>
                <Button
                  variant={hospitalType === "mri-only" ? "default" : "outline"}
                  onClick={() => setHospitalType("mri-only")}
                  className="w-full justify-start"
                >
                  <div className="text-left">
                    <div className="font-medium">MRIのみ</div>
                    <div className="text-xs opacity-70">小規模病院・クリニック</div>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current DaTscan Analysis */}
        {hospitalType === "with-gamma" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                現在のDaTscan収支
              </CardTitle>
              <CardDescription>検査1回あたりの損益</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>収益</span>
                  <span className="text-green-600">{formatCurrency(datScanRevenue)}</span>
                </div>
                <div className="border-t pt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>検査薬剤費</span>
                    <span className="text-red-600">{formatCurrency(datScanCosts.reagents)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>人件費</span>
                    <span className="text-red-600">{formatCurrency(datScanCosts.staff)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ガンマカメラ費</span>
                    <span className="text-red-600">{formatCurrency(datScanCosts.gammaCamera)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>運営費・その他</span>
                    <span className="text-red-600">{formatCurrency(datScanCosts.operations + datScanCosts.other)}</span>
                  </div>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>1回あたり損失</span>
                  <span className="text-red-600">{formatCurrency(datScanLossPerTest)}</span>
                </div>
              </div>

              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-sm text-red-700">月間損失</div>
                <div className="text-xl font-bold text-red-600">
                  {formatCurrency(datScanLossPerTest * monthlyTests)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {hospitalType === "mri-only" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                現在の状況
              </CardTitle>
              <CardDescription>パーキンソン病検査の新規導入</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <div className="text-gray-500 mb-2">現在パーキンソン病の</div>
                <div className="text-gray-500 mb-4">専門検査は実施していません</div>
                <Badge variant="outline" className="px-4 py-2">
                  新規検査機会の創出
                </Badge>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-blue-700">月間新規収益機会</div>
                <div className="text-xl font-bold text-blue-600">{formatCurrency(monthlyBenefit)}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* MRI Solution Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              MRI診断ソリューション
            </CardTitle>
            <CardDescription>{isInsuranceCovered ? "保険償還後" : "保険償還前"}の収支</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>検査収益</span>
                <span className="text-green-600">{formatCurrency(currentSolution.revenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>当社費用</span>
                <span className="text-red-600">{formatCurrency(currentSolution.companyFee)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>病院利益</span>
                <span className="text-green-600">{formatCurrency(currentSolution.hospitalProfit)}</span>
              </div>
            </div>

            <Badge variant="secondary" className="w-full justify-center py-2">
              正味メリット: {formatCurrency(currentSolution.netBenefit)}/回
            </Badge>

            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-700">月間メリット</div>
              <div className="text-xl font-bold text-green-600">{formatCurrency(monthlyBenefit)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            経済効果サマリー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">月間効果</TabsTrigger>
              <TabsTrigger value="yearly">年間効果</TabsTrigger>
            </TabsList>

            <TabsContent value="monthly" className="space-y-4">
              <div
                className={`grid grid-cols-1 gap-4 ${hospitalType === "with-gamma" ? "md:grid-cols-3" : "md:grid-cols-2"}`}
              >
                {hospitalType === "with-gamma" && (
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-red-700">DaTscan月間損失</div>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(datScanLossPerTest * monthlyTests)}
                    </div>
                  </div>
                )}
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-green-700">
                    {hospitalType === "with-gamma" ? "MRI診断月間メリット" : "月間新規収益"}
                  </div>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(monthlyBenefit)}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-blue-700">
                    {hospitalType === "with-gamma" ? "月間改善効果" : "月間総メリット"}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalMonthlyBenefit)}</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="yearly" className="space-y-4">
              <div
                className={`grid grid-cols-1 gap-4 ${hospitalType === "with-gamma" ? "md:grid-cols-3" : "md:grid-cols-2"}`}
              >
                {hospitalType === "with-gamma" && (
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-red-700">DaTscan年間損失</div>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(datScanLossPerTest * yearlyTests)}
                    </div>
                  </div>
                )}
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-green-700">
                    {hospitalType === "with-gamma" ? "MRI診断年間メリット" : "年間新規収益"}
                  </div>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(yearlyBenefit)}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-blue-700">
                    {hospitalType === "with-gamma" ? "年間改善効果" : "年間総メリット"}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalYearlyBenefit)}</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Key Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>導入メリット</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">経済的メリット</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                {hospitalType === "with-gamma" ? (
                  <>
                    <li>• DaTscanの赤字解消</li>
                    <li>• 検査あたり{formatCurrency(currentSolution.netBenefit)}の正味メリット</li>
                    <li>• 薬剤費・人件費の大幅削減</li>
                    <li>• ガンマカメラ維持費用の削減</li>
                  </>
                ) : (
                  <>
                    <li>• 新規検査収益の創出</li>
                    <li>• 検査あたり{formatCurrency(currentSolution.netBenefit)}の純利益</li>
                    <li>• 既存MRI設備の有効活用</li>
                    <li>• 追加設備投資不要</li>
                  </>
                )}
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">運用メリット</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• MRIでの簡易スクリーニング</li>
                <li>• 検査時間の短縮</li>
                <li>• 放射線被曝なし</li>
                {hospitalType === "with-gamma" ? (
                  <li>• 検査薬剤の在庫管理不要</li>
                ) : (
                  <li>• 専門医紹介前のスクリーニング</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
