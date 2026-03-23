import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";

const service = new DashboardService();

export class DashboardController {

  async getDashboard(req: Request, res: Response) {
    try {
      const metrics = await service.getMetrics();
      const summary = await service.getSummary();
      const recentOrders = await service.getRecentOrders();

      return res.json({
        metrics,
        summary,
        recentOrders,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Erro ao carregar dashboard",
      });
    }
  }
}