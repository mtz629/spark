package org.apache.spark.dataflint.api

import org.apache.spark.dataflint.listener.DataflintStore
import org.apache.spark.internal.Logging
import org.apache.spark.ui.{SparkUI, WebUIPage}
import org.json4s.{Extraction, JObject, JsonAST}
import org.json4s.JsonAST.JValue

import javax.servlet.http.HttpServletRequest
import scala.xml.Node

class DataflintIcebergPage(ui: SparkUI, dataflintStore: DataflintStore)
  extends WebUIPage("iceberg") with Logging {
  override def renderJson(request: HttpServletRequest): JsonAST.JValue = {
    try {
      val offset = request.getParameter("offset")
      val length = request.getParameter("length")
      if (offset == null || length == null) {
        return JObject()
      }

      val commits = dataflintStore.icebergCommits(offset.toInt, length.toInt)
      val icebergInfo = IcebergInfo(commitsInfo = commits)
      val jsonValue: JValue = Extraction.decompose(icebergInfo)(org.json4s.DefaultFormats)
      jsonValue
    }
    catch {
      case e: Throwable => {
        logError("failed to serve dataflint iceberg", e)
        JObject()
      }
    }
  }
  override def render(request: HttpServletRequest): Seq[Node] = Seq[Node]()
}
