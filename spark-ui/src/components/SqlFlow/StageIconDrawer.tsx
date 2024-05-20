import {
    Box,
    Link,
    Typography
} from "@mui/material";
import { duration } from "moment";
import React from "react";
import { useAppSelector } from "../../Hooks";
import {
    SQLNodeExchangeStageData,
    SQLNodeStageData,
    SparkStageStore,
} from "../../interfaces/AppStore";
import { humanFileSize, humanizeTimeDiff } from "../../utils/FormatUtils";
import { BASE_CURRENT_PAGE } from "../../utils/UrlConsts";
import { getBaseAppUrl } from "../../utils/UrlUtils";
import BytesDistributionChart from "./BytesDistributionChart";
import DurationDistributionChart from "./DurationDistributionChart";
import NumbersDistributionChart from "./NumbersDistributionChart";

const linkToStage = (stageId: number) => {
    window.open(
        `${getBaseAppUrl(BASE_CURRENT_PAGE)}/stages/stage/?id=${stageId}&attempt=0`, // TODO: fetch attempts from store config
        "_blank",
    );
};

function MultiStageIconTooltip({
    stage,
}: {
    stage: SQLNodeExchangeStageData;
}): JSX.Element {
    const stages = useAppSelector((state) => state.spark.stages);
    const readStage = stages?.find(
        (currentStage) => stage.readStage === currentStage.stageId,
    );
    const writeStage = stages?.find(
        (currentStage) => stage.writeStage === currentStage.stageId,
    );
    if (readStage === undefined && writeStage === undefined) return <div></div>;

    return (
        <Box>
            <Box sx={{ m: 1 }} display="flex" gap={1}>
                {readStage === undefined ? undefined : <Link
                    color="inherit"
                    onClick={(evn) => linkToStage(stage.readStage)}
                >
                    Read Stage - {stage.readStage}
                </Link>}
                {writeStage === undefined ? undefined : <Link
                    color="inherit"
                    onClick={(evn) => linkToStage(stage.writeStage)}
                >
                    Write Stage - {stage.writeStage}
                </Link>}
            </Box>
            {writeStage === undefined ? undefined : <Box sx={{ m: 1 }}>
                <Typography variant="h6">Write Stage</Typography>
                <StageSummary stageData={writeStage} />
                {writeStage.durationDistribution !== undefined ? <DurationDistributionChart durationDist={writeStage.durationDistribution} /> : undefined}
                {writeStage.shuffleWriteDistribution !== undefined && writeStage.shuffleWriteDistribution.some(x => x !== 0) ? <BytesDistributionChart title="shuffle write (bytes)" bytesDist={writeStage.shuffleWriteDistribution} /> : undefined}
                {writeStage.spillDiskDistriution !== undefined && writeStage.spillDiskDistriution.some(x => x !== 0) ? <NumbersDistributionChart title="Spill disk (bytes)" numbersDist={writeStage.spillDiskDistriution} /> : undefined}
            </Box>}
            {readStage === undefined ? undefined : <Box sx={{ m: 1 }}>
                <Typography variant="h6">Read Stage</Typography>
                <StageSummary stageData={readStage} />
                {readStage.durationDistribution !== undefined ? <DurationDistributionChart durationDist={readStage.durationDistribution} /> : undefined}
                {readStage.shuffleReadDistribution !== undefined && readStage.shuffleReadDistribution.some(x => x !== 0) ? <BytesDistributionChart title="shuffle read (bytes)" bytesDist={readStage.shuffleReadDistribution} /> : undefined}
                {readStage.spillDiskDistriution !== undefined && readStage.spillDiskDistriution.some(x => x !== 0) ? <NumbersDistributionChart title="Spill disk (bytes)" numbersDist={readStage.spillDiskDistriution} /> : undefined}
            </Box>}
        </Box>
    );
}

function SingleStageIconTooltip({
    stage,
}: {
    stage: SQLNodeStageData;
}): JSX.Element {
    const stages = useAppSelector((state) => state.spark.stages);
    const stageData = stages?.find(
        (currentStage) =>
            stage.type === "onestage" && stage.stageId === currentStage.stageId,
    );
    if (stageData === undefined) return <div></div>;

    return (
        <Box sx={{ m: 1 }} display="flex" flexDirection="column" gap={1}>
            <Link color="inherit" onClick={(evn) => linkToStage(stage.stageId)}>
                Stage {stage.stageId}
            </Link>
            <StageSummary stageData={stageData} />
            {stageData.durationDistribution !== undefined ? <DurationDistributionChart durationDist={stageData.durationDistribution} /> : undefined}
            {stageData.inputDistribution !== undefined && stageData.inputDistribution.some(x => x !== 0) ? <BytesDistributionChart title="input bytes" bytesDist={stageData.inputDistribution} /> : undefined}
            {stageData.inputRowsDistribution !== undefined && stageData.inputRowsDistribution.some(x => x !== 0) ? <NumbersDistributionChart title="input rows" numbersDist={stageData.inputRowsDistribution} /> : undefined}
            {stageData.outputDistribution !== undefined && stageData.outputDistribution.some(x => x !== 0) ? <BytesDistributionChart title="output bytes" bytesDist={stageData.outputDistribution} /> : undefined}
            {stageData.outputRowsDistribution !== undefined && stageData.outputRowsDistribution.some(x => x !== 0) ? <NumbersDistributionChart title="output rows" numbersDist={stageData.outputRowsDistribution} /> : undefined}
            {stageData.spillDiskDistriution !== undefined && stageData.spillDiskDistriution.some(x => x !== 0) ? <NumbersDistributionChart title="output rows" numbersDist={stageData.spillDiskDistriution} /> : undefined}
        </Box>)
}

function StageSummary({
    stageData,
}: {
    stageData: SparkStageStore;
}): JSX.Element {
    const executors = useAppSelector((state) => state.spark.executors);
    if (executors === undefined || executors.length === 0) return <div></div>;

    const maxTasks = executors[0].maxTasks;

    return (
        <Box>
            <Typography variant="body2">
                <strong>Tasks number: </strong> {stageData.numTasks}
            </Typography>
            {stageData.stageRealTimeDurationMs === undefined ? undefined : <Typography variant="body2">
                <strong>Stage duration:</strong>{" "}
                {humanizeTimeDiff(
                    duration(stageData.stageRealTimeDurationMs),
                )}
            </Typography>}
            <Typography variant="body2">
                <strong>Total executors time:</strong>{" "}
                {humanizeTimeDiff(
                    duration(stageData.metrics.executorRunTime / maxTasks),
                )}
            </Typography>
            <Typography variant="body2">
                <strong>Median task duration:</strong>{" "}
                {humanizeTimeDiff(
                    duration(
                        stageData.durationDistribution !== undefined
                            ? stageData.durationDistribution[5]
                            : 0,
                    ),
                )}
            </Typography>
            {stageData.metrics.inputBytes !== 0 ? (
                <Typography variant="body2">
                    <strong>Median task input size:</strong>{" "}
                    {humanFileSize(
                        stageData.inputDistribution !== undefined
                            ? stageData.inputDistribution[5]
                            : 0,
                    )}
                </Typography>
            ) : undefined}
            {stageData.metrics.outputBytes !== 0 ? (
                <Typography variant="body2">
                    <strong>Median task output size:</strong>{" "}
                    {humanFileSize(
                        stageData.outputDistribution !== undefined
                            ? stageData.outputDistribution[5]
                            : 0,
                    )}
                </Typography>
            ) : undefined}
            {stageData.metrics.shuffleReadBytes !== 0 ? (
                <Typography variant="body2">
                    <strong>Median task shuffle read size:</strong>{" "}
                    {humanFileSize(
                        stageData.shuffleReadDistribution !== undefined
                            ? stageData.shuffleReadDistribution[5]
                            : 0,
                    )}
                </Typography>
            ) : undefined}
            {stageData.metrics.shuffleWriteBytes !== 0 ? (
                <Typography variant="body2">
                    <strong>Median task shuffle write size:</strong>{" "}
                    {humanFileSize(
                        stageData.shuffleWriteDistribution !== undefined
                            ? stageData.shuffleWriteDistribution[5]
                            : 0,
                    )}
                </Typography>
            ) : undefined}
        </Box>
    );
}

export default function StageIconDrawer({
    stage,
}: {
    stage: SQLNodeStageData | SQLNodeExchangeStageData | undefined;
}): JSX.Element {
    if (stage === undefined) return <div></div>;

    return stage.type === "onestage" ? (
        <SingleStageIconTooltip stage={stage} />
    ) : (
        <MultiStageIconTooltip stage={stage} />
    );
}
