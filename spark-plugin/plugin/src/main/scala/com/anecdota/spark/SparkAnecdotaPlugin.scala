package com.anecdota.spark

import org.apache.spark.{SparkContext, SparkUILoader}
import org.apache.spark.api.plugin.{DriverPlugin, ExecutorPlugin, PluginContext, SparkPlugin}
import org.apache.spark.internal.Logging

import java.util
import scala.collection.JavaConverters.mapAsJavaMapConverter

class SparkAnecdotaPlugin extends SparkPlugin {
  override def driverPlugin(): DriverPlugin = new SparkAnecdotaDriverPlugin()

  override def executorPlugin(): ExecutorPlugin = null
}

class SparkAnecdotaDriverPlugin extends DriverPlugin with Logging {
  var sc: SparkContext = null

  override def init(sc: SparkContext, pluginContext: PluginContext): util.Map[String, String] = {
    this.sc = sc
    Map[String, String]().asJava
  }

  override def registerMetrics(appId: String, pluginContext: PluginContext): Unit = {
    var webUrl = SparkUILoader.load(sc)
    logInfo(s"spark devtool url is $webUrl/devtool")
    super.registerMetrics(appId, pluginContext)
  }
}