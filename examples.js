exports.examples = {
  1: {
    id: 1,
    better: 'after',
    before: [
      'import java.net.URLDecoder;\n' +
      '\n' +
      '@Service\n' +
      '@RequiredArgsConstructor\n' +
      'public class ResourceCreateHandler {\n' +
      '    private final MetadataAdjuster metadataAdjuster;\n' +
      '\n' +
      '    public ResourceContents adjustContents(ResourceContents contents) {\n' +
      '        contents.getContents.stream()\n' +
      '                .map(content -> {\n' +
      '                    if (content.getMetadata().getControl() == MetadataControl.DOUBLE) {\n' +
      '                        adjustDoubleMetadataValue(content.getValue(), content.getMetadata());\n' +
      '                    } else if (content.getMetadata().getControl() == MetadataControl.DATE) {\n' +
      '                        adjustDateMetadataValue(content.getValue(), content.getMetadata());\n' +
      '                    } else if (content.getMetadata().getControl() == MetadataControl.FILE) {\n' +
      '                        adjustFileMetadataValue(content.getValue(), content.getMetadata());\n' +
      '                    } else if (content.getMetadata().getControl() == MetadataControl.RELATIONSHIP) {\n' +
      '                        adjustRelationshipMetadataValue(content.getValue(), content.getMetadata());\n' +
      '                    }\n' +
      '                });\n' +
      '        return contents;\n' +
      '    }\n' +
      '\n' +
      '    private MetadataValue adjustDateMetadataValue(MetadataValue value, Metadata metadata) {\n' +
      '        if (value.getVaulue() == null) {\n' +
      '            return null;\n' +
      '        }\n' +
      '        MetadataValue result = MetadataDateControlConverterUtil.convertDateToFlexibleDate(\n' +
      '                value.getVaulue().getFrom(),\n' +
      '                value.getVaulue().getTo(),\n' +
      '                value.getVaulue().getMode(),\n' +
      '                value.getVaulue().getRangeMode()\n' +
      '        );\n' +
      '        return value.withNewValue(result);\n' +
      '    }\n' +
      '\n' +
      '    private MetadataValue adjustDoubleMetadataValue(MetadataValue value, Metadata metadata) {\n' +
      '        String textValue = value.getValue().replace(",", ".").trim();\n' +
      '        Float floatValue = Float.valueOf(textValue);\n' +
      '        return value.withNewValue(floatValue);\n' +
      '    }\n' +
      '\n' +
      '    private MetadataValue adjustFileMetadataValue(MetadataValue value, Metadata metadata) {\n' +
      '        String path = URLDecoder.decode(value.getValue(), "UTF-8");\n' +
      '        return value.withNewValue(path);\n' +
      '    }\n' +
      '\n' +
      '    private MetadataValue adjustRelationshipMetadataValue(MetadataValue value, Metadata metadata) {\n' +
      '        int result = value.getValue() instanceof ResourceEntity\n' +
      '                ? value.getValue().getId()\n' +
      '                : Integer.valueOf(value.getValue());\n' +
      '        return value.withNewValue(result);\n' +
      '    }\n' +
      '}\n'],
    after: [
      'public interface MetadataAdjusterI {\n' +
      '    public MetadataValue adjustMetadataValue(MetadataValue value, Metadata metadata);\n' +
      '}\n', '@Service\n' +
      'public class MetadataAdjuster implements MetadataAdjusterI {\n' +
      '    private Map<MetadataControl, MetadataAdjusterI> adjusters;\n' +
      '\n' +
      '    @Override\n' +
      '    public MetadataValue adjustMetadataValue(MetadataValue value, Metadata metadata) {\n' +
      '        return null;\n' +
      '    }\n' +
      '\n' +
      '    public MetadataValue adjustMetadataValue(MetadataValue value, Metadata metadata) {\n' +
      '        if (adjusters.isEmpty()) {\n' +
      '            buildAdjustersMap();\n' +
      '        }\n' +
      '        MetadataAdjusterI adjuster = adjusters.get(metadata.getControl());\n' +
      '        return adjuster.adjustMetadataValue(value, metadata);\n' +
      '    }\n' +
      '\n' +
      '    private void buildAdjustersMap() {\n' +
      '        adjusters.put(MetadataControl.DOUBLE) = new DoubleMetadataAdjuster();\n' +
      '        adjusters.put(MetadataControl.DATE) = new DateMetadataAdjuster();\n' +
      '        adjusters.put(MetadataControl.FILE) = new FileMetadataAdjuster();\n' +
      '        adjusters.put(MetadataControl.RELATIONSHIP) = new RelationshipMetadataAdjuster();\n' +
      '    }\n' +
      '}\n', 'public class RelationshipMetadataAdjuster implements MetadataAdjusterI {\n' +
      '    @Override\n' +
      '    public MetadataValue adjustMetadataValue(MetadataValue value, Metadata metadata) {\n' +
      '        int result = value.getValue() instanceof ResourceEntity\n' +
      '                ? value.getValue().getId()\n' +
      '                : Integer.valueOf(value.getValue());\n' +
      '        return value.withNewValue(result);\n' +
      '    }\n' +
      '}\n', 'import java.net.URLDecoder;\n' +
      '\n' +
      'public class FileMetadataAdjuster implements MetadataAdjusterI {\n' +
      '    @Override\n' +
      '    public MetadataValue adjustMetadataValue(MetadataValue value, Metadata metadata) {\n' +
      '        String path = URLDecoder.decode(value.getValue(), "UTF-8");\n' +
      '        return value.withNewValue(path);\n' +
      '    }\n' +
      '}\n', 'public class DoubleMetadataAdjuster implements MetadataAdjusterI {\n' +
      '    @Override\n' +
      '    public MetadataValue adjustMetadataValue(MetadataValue value, Metadata metadata) {\n' +
      '        String textValue = value.getValue().replace(",", ".").trim();\n' +
      '        Float floatValue = Float.valueOf(textValue);\n' +
      '        return value.withNewValue(floatValue);\n' +
      '    }\n' +
      '}\n', 'public class DateMetadataAdjuster implements MetadataAdjusterI {\n' +
      '    @Override\n' +
      '    public MetadataValue adjustMetadataValue(MetadataValue value, Metadata metadata) {\n' +
      '        if (value.getVaulue() == null) {\n' +
      '            return null;\n' +
      '        }\n' +
      '        MetadataValue result = MetadataDateControlConverterUtil.convertDateToFlexibleDate(\n' +
      '                value.getVaulue().getFrom(),\n' +
      '                value.getVaulue().getTo(),\n' +
      '                value.getVaulue().getMode(),\n' +
      '                value.getVaulue().getRangeMode()\n' +
      '        );\n' +
      '        return value.withNewValue(result);\n' +
      '    }\n' +
      '}\n', '@Service\n' +
      '@RequiredArgsConstructor\n' +
      'public class ResourceCreateHandler {\n' +
      '    private final MetadataAdjuster metadataAdjuster;\n' +
      '\n' +
      '    public ResourceContents adjustContents(ResourceContents contents) {\n' +
      '        contents.getContents.stream()\n' +
      '                .map(content -> metadataAdjuster\n' +
      '                        .adjustMetadataValue(content.getValue(), content.getMetadata()));\n' +
      '        return contents;\n' +
      '    }\n' +
      '}\n']
  },
  2: {
    id: 2,
    better: 'after',
    before: ['public class Car {\n' +
    '    private final Type type;\n' +
    '    private final int seats;\n' +
    '    private final Engine engine;\n' +
    '    private final Transmission transmission;\n' +
    '    private final TripComputer tripComputer;\n' +
    '    private final GPSNavigator gpsNavigator;\n' +
    '    private double fuel = 0;\n' +
    '\n' +
    '    public Car(Type type, int seats, Engine engine, Transmission transmission,\n' +
    '               TripComputer tripComputer, GPSNavigator gpsNavigator) {\n' +
    '        this.type = type;\n' +
    '        this.seats = seats;\n' +
    '        this.engine = engine;\n' +
    '        this.transmission = transmission;\n' +
    '        this.tripComputer = tripComputer;\n' +
    '        this.tripComputer.setCar(this);\n' +
    '        this.gpsNavigator = gpsNavigator;\n' +
    '    }\n' +
    '\n' +
    '    public Car(Type type, int seats, Engine engine,\n' +
    '               Transmission transmission, GPSNavigator gpsNavigator) {\n' +
    '        this.type = type;\n' +
    '        this.seats = seats;\n' +
    '        this.engine = engine;\n' +
    '        this.transmission = transmission;\n' +
    '        this.gpsNavigator = gpsNavigator;\n' +
    '    }\n' +
    '\n' +
    '    public Car(Type type, int seats, Engine engine, Transmission transmission) {\n' +
    '        this.type = type;\n' +
    '        this.seats = seats;\n' +
    '        this.engine = engine;\n' +
    '        this.transmission = transmission;\n' +
    '    }\n' +
    '\n' +
    '    public Type getType() {\n' +
    '        return type;\n' +
    '    }\n' +
    '\n' +
    '    public double getFuel() {\n' +
    '        return fuel;\n' +
    '    }\n' +
    '\n' +
    '    public int getSeats() {\n' +
    '        return seats;\n' +
    '    }\n' +
    '\n' +
    '    public Engine getEngine() {\n' +
    '        return engine;\n' +
    '    }\n' +
    '\n' +
    '    public Transmission getTransmission() {\n' +
    '        return transmission;\n' +
    '    }\n' +
    '\n' +
    '    public TripComputer getTripComputer() {\n' +
    '        return tripComputer;\n' +
    '    }\n' +
    '\n' +
    '    public GPSNavigator getGpsNavigator() {\n' +
    '        return gpsNavigator;\n' +
    '    }\n' +
    '}\n', 'public class Company {\n' +
    '\n' +
    '    private Car constructBasicCar() {\n' +
    '        CarGenerator carGenerator = Car.generator()\n' +
    '                .setType(Type.BASE)\n' +
    '                .setEngine(new Engine(0.9, 0))\n' +
    '                .setSeats(2)\n' +
    '                .setTransmission(Transmission.MANUAL);\n' +
    '        return carGenerator.getResult();\n' +
    '    }\n' +
    '\n' +
    '    public Car orderCar(Type type) {\n' +
    '        Car car = null;\n' +
    '        if (type == Type.SUV) {\n' +
    '            car = new Car(type, 6, new Engine(2.5, 0), Transmission.MANUAL,\n' +
    '                    new GPSNavigator());\n' +
    '        }\n' +
    '        if (type == Type.CITY) {\n' +
    '            car = new Car(type, 2, new Engine(1.2, 0), Transmission.AUTOMATIC,\n' +
    '                    new TripComputer(), new GPSNavigator());\n' +
    '        }\n' +
    '        if (type == Type.SPORTS_CAR) {\n' +
    '            car = new Car(type, 2, new Engine(3.0, 0), Transmission.SEMI_AUTOMATIC,\n' +
    '                    new TripComputer(), new GPSNavigator());\n' +
    '        }\n' +
    '        if (type == Type.BASE) {\n' +
    '            car = new Car(type, 2, new Engine(0.9, 0), Transmission.MANUAL);\n' +
    '        }\n' +
    '        return car;\n' +
    '    }\n' +
    '}'],
    after: ['public class Car {\n' +
    '    private final Type type;\n' +
    '    private final int seats;\n' +
    '    private final Engine engine;\n' +
    '    private final Transmission transmission;\n' +
    '    private final TripComputer tripComputer;\n' +
    '    private final GPSNavigator gpsNavigator;\n' +
    '    private double fuel = 0;\n' +
    '\n' +
    '    public Car(Type type, int seats, Engine engine, Transmission transmission,\n' +
    '               TripComputer tripComputer, GPSNavigator gpsNavigator) {\n' +
    '        this.type = type;\n' +
    '        this.seats = seats;\n' +
    '        this.engine = engine;\n' +
    '        this.transmission = transmission;\n' +
    '        this.tripComputer = tripComputer;\n' +
    '        this.tripComputer.setCar(this);\n' +
    '        this.gpsNavigator = gpsNavigator;\n' +
    '    }\n' +
    '\n' +
    '    public static CarGenerator generator() {\n' +
    '        return new CarGenerator();\n' +
    '    }\n' +
    '\n' +
    '    public Type getType() {\n' +
    '        return type;\n' +
    '    }\n' +
    '\n' +
    '    public double getFuel() {\n' +
    '        return fuel;\n' +
    '    }\n' +
    '\n' +
    '    public int getSeats() {\n' +
    '        return seats;\n' +
    '    }\n' +
    '\n' +
    '    public Engine getEngine() {\n' +
    '        return engine;\n' +
    '    }\n' +
    '\n' +
    '    public Transmission getTransmission() {\n' +
    '        return transmission;\n' +
    '    }\n' +
    '\n' +
    '    public TripComputer getTripComputer() {\n' +
    '        return tripComputer;\n' +
    '    }\n' +
    '\n' +
    '    public GPSNavigator getGpsNavigator() {\n' +
    '        return gpsNavigator;\n' +
    '    }\n' +
    '}', 'public class CarGenerator {\n' +
    '    private Type type;\n' +
    '    private int seats;\n' +
    '    private Engine engine;\n' +
    '    private Transmission transmission;\n' +
    '    private TripComputer tripComputer;\n' +
    '    private GPSNavigator gpsNavigator;\n' +
    '\n' +
    '    public CarGenerator setType(Type type) {\n' +
    '        this.type = type;\n' +
    '        return this;\n' +
    '    }\n' +
    '\n' +
    '    public CarGenerator setSeats(int seats) {\n' +
    '        this.seats = seats;\n' +
    '        return this;\n' +
    '    }\n' +
    '\n' +
    '    public CarGenerator setEngine(Engine engine) {\n' +
    '        this.engine = engine;\n' +
    '        return this;\n' +
    '    }\n' +
    '\n' +
    '    public CarGenerator setTransmission(Transmission transmission) {\n' +
    '        this.transmission = transmission;\n' +
    '        return this;\n' +
    '    }\n' +
    '\n' +
    '    public CarGenerator setTripComputer(TripComputer tripComputer) {\n' +
    '        this.tripComputer = tripComputer;\n' +
    '        return this;\n' +
    '    }\n' +
    '\n' +
    '    public CarGenerator setGPSNavigator(GPSNavigator gpsNavigator) {\n' +
    '        this.gpsNavigator = gpsNavigator;\n' +
    '        return this;\n' +
    '    }\n' +
    '\n' +
    '    public Car getResult() {\n' +
    '        return new Car(type, seats, engine, transmission, tripComputer, gpsNavigator);\n' +
    '    }\n' +
    '}', 'public class Company {\n' +
    '    private Car constructBasicCar() {\n' +
    '        CarGenerator carGenerator = Car.generator()\n' +
    '                .setType(Type.BASE)\n' +
    '                .setEngine(new Engine(0.9, 0))\n' +
    '                .setSeats(2)\n' +
    '                .setTransmission(Transmission.MANUAL);\n' +
    '        return carGenerator.getResult();\n' +
    '    }\n' +
    '\n' +
    '    private Car constructSportsCar() {\n' +
    '        CarGenerator carGenerator = Car.generator()\n' +
    '                .setType(Type.SPORTS_CAR)\n' +
    '                .setEngine(new Engine(3.0, 0))\n' +
    '                .setSeats(2)\n' +
    '                .setTransmission(Transmission.SEMI_AUTOMATIC)\n' +
    '                .setTripComputer(new TripComputer())\n' +
    '                .setGPSNavigator(new GPSNavigator());\n' +
    '        return carGenerator.getResult();\n' +
    '    }\n' +
    '\n' +
    '    private Car constructCityCar() {\n' +
    '        CarGenerator carGenerator = Car.generator()\n' +
    '                .setType(Type.CITY_CAR)\n' +
    '                .setEngine(new Engine(1.2, 0))\n' +
    '                .setSeats(2)\n' +
    '                .setTransmission(Transmission.AUTOMATIC)\n' +
    '                .setTripComputer(new TripComputer())\n' +
    '                .setGPSNavigator(new GPSNavigator());\n' +
    '        return carGenerator.getResult();\n' +
    '    }\n' +
    '\n' +
    '    private Car constructSUV() {\n' +
    '        CarGenerator carGenerator = Car.generator()\n' +
    '                .setType(Type.SUV)\n' +
    '                .setEngine(new Engine(2.5, 0))\n' +
    '                .setSeats(6)\n' +
    '                .setTransmission(Transmission.MANUAL)\n' +
    '                .setGPSNavigator(new GPSNavigator());\n' +
    '        return carGenerator.getResult();\n' +
    '    }\n' +
    '\n' +
    '    public Car orderCar(Type type) {\n' +
    '        Car car = null;\n' +
    '        switch (type) {\n' +
    '            case Type.BASE:\n' +
    '                car = constructBasicCar();\n' +
    '            break;\n' +
    '            case Type.CITY_CAR:\n' +
    '                car = constructCityCar();\n' +
    '            break;\n' +
    '            case Type.SUV:\n' +
    '                car = constructSUV();\n' +
    '            break;\n' +
    '            case Type.SPORTS_CAR:\n' +
    '                car = constructSportsCar();\n' +
    '            break;\n' +
    '        }\n' +
    '        return car;\n' +
    '    }\n' +
    '}']
  },
  3: {
    id: 3,
    better: 'before',
    before: ['@Service\n' +
    'public class MagnetService {\n' +
    '    private final ClipsService clipsService;\n' +
    '    private final ZoomService zoomService;\n' +
    '\n' +
    '    ClipDropData clipDropData = new ClipDropData(0, "left");\n' +
    '    private int pickUpPosition;\n' +
    '\n' +
    '    constructor(ClipsService clipsService, ZoomService zoomService) {\n' +
    '    }\n' +
    '\n' +
    '    void setPickUpPosition(int position) {\n' +
    '        this.pickUpPosition = position;\n' +
    '    }\n' +
    '\n' +
    '    MagnetCursorData changeMagnetCursorPosition(int clientX, SwimLaneType mediaType, Clip clip) {\n' +
    '        int relativePosition = clientX - SwimLaneConstans.getActionLanesWidth() + SwimLaneConstans.getSwimLaneScrollValue();\n' +
    '        DropPosition dropPosition = new DropPosition(-1, -1);\n' +
    '        if (clip != null) {\n' +
    '            dropPosition.left = clip.leftPosition + (clientX - this.pickUpPosition);\n' +
    '            dropPosition.right = clip.rightPosition + (clientX - this.pickUpPosition);\n' +
    '        } else {\n' +
    '            dropPosition.left = relativePosition;\n' +
    '            dropPosition.right = relativePosition + WindowUtil.getClientWidth;\n' +
    '        }\n' +
    '        int magnetCursorPosition = Integer.MAX_VALUE;\n' +
    '        int minDistance = Integer.MAX_VALUE;\n' +
    '        boolean sameLaneChecking = false;\n' +
    '        for (Map.Entry<String, List<SwimLane>> entry : this.swimLanes.entrySet()) {\n' +
    '            for(int i = 0; i < entry.getValue().size(); i++) {\n' +
    '                SwimLane lane = entry.getValue().get(i);\n' +
    '                SuggestedPosition suggestedPosition = new SuggestedPosition(0, 0, this.clipDropData.edge);\n' +
    '                if (clip != null) {\n' +
    '                    sameLaneChecking = swimLane == this.swimLanesService.getSwimLaneForClip(clip);\n' +
    '                }\n' +
    '                if (!lane.clips.length) { // empty swim lane\n' +
    '                    suggestedPosition.position = 0;\n' +
    '                    suggestedPosition.newMinDistance = Math.abs(dropPosition.left - suggestedPosition.startPosition);\n' +
    '                    suggestedPosition.newSuggestedEdge = "left";\n' +
    '                } else {\n' +
    '                    int indexOfClipAfter = this.clipsService.getIndexOfClip(dropPosition.left, lane.clips, false);\n' +
    '                    int indexOfClipAfterForEndPosition = this.clipsService.getIndexOfClip(dropPosition.right, lane.clips, false);\n' +
    '                    Clip fakeStartClip;\n' +
    '                    Clip fakeStopClip;\n' +
    '                    if (indexOfClipAfter == 0) {\n' +
    '                        fakeStartClip = new Clip(0, 0, new Media());\n' +
    '                        fakeStartClip.setPosition(0, 0);\n' +
    '                        lane.clips.add(0, fakeStartClip);\n' +
    '                        indexOfClipAfter++;\n' +
    '                        indexOfClipAfterForEndPosition++;\n' +
    '                    }\n' +
    '                    if (lane.clips[indexOfClipAfterForEndPosition] != null) {\n' +
    '                        fakeStopClip = new Clip(Integer.MAX_VALUE, Integer.MAX_VALUE, new Media());\n' +
    '                        fakeStopClip.setPosition(Integer.MAX_VALUE, Integer.MAX_VALUE);\n' +
    '                        lane.clips.add(fakeStopClip);\n' +
    '                    }\n' +
    '                    // 1. Check for same lane\n' +
    '                    suggestedPosition = this.getSuggestedPosition(lane.clips[indexOfClipAfter - 1].rightPosition,\n' +
    '                            lane.clips[indexOfClipAfterForEndPosition].leftPosition, dropPosition);\n' +
    '                    suggestedPosition.newMinDistance = this.getNewMinDistance(lane.clips[indexOfClipAfter - 1].rightPosition,\n' +
    '                            lane.clips[indexOfClipAfterForEndPosition].leftPosition, dropPosition);\n' +
    '                    // 2. Check for another lanes\n' +
    '                    if (!sameLaneChecking) {\n' +
    '                        this.alternativePosition(lane.clips[indexOfClipAfter - 1].leftPosition, dropPosition.left, "left", suggestedPosition);\n' +
    '                        this.alternativePosition(lane.clips[indexOfClipAfter].leftPosition, dropPosition.left, "left", suggestedPosition);\n' +
    '                        this.alternativePosition(lane.clips[indexOfClipAfterForEndPosition - 1].leftPosition, dropPosition.right, "right", suggestedPosition);\n' +
    '                        this.alternativePosition(lane.clips[indexOfClipAfterForEndPosition - 1].rightPosition, dropPosition.right, "right", suggestedPosition);\n' +
    '                    }\n' +
    '                }\n' +
    '                if (suggestedPosition.newMinDistance < minDistance) {\n' +
    '                    minDistance = suggestedPosition.newMinDistance;\n' +
    '                    magnetCursorPosition = suggestedPosition.position;\n' +
    '                    this.clipDropData.position = magnetCursorPosition;\n' +
    '                    this.clipDropData.edge = suggestedPosition.newSuggestedEdge;\n' +
    '                }\n' +
    '            }\n' +
    '        }\n' +
    '    }\n' +
    '\n' +
    '    void alternativePosition(int clipPosition, int position, String edge, SuggestedPosition suggestedPosition) {\n' +
    '        int alternativeDistance = Math.abs(clipPosition - position);\n' +
    '        if (alternativeDistance < suggestedPosition.newMinDistance) {\n' +
    '            suggestedPosition.newMinDistance = alternativeDistance;\n' +
    '            suggestedPosition.newSuggestedEdge = edge;\n' +
    '            suggestedPosition.position = clipPosition;\n' +
    '        }\n' +
    '    }\n' +
    '\n' +
    '    void getSuggestedPosition(int startPos, int endPos, DropPosition dropPos, SuggestedPosition suggestedPosition) {\n' +
    '        if (Math.abs(startPos - dropPos.left) < Math.abs(endPos - dropPos.right)) {\n' +
    '            suggestedPosition.newSuggestedEdge = "left";\n' +
    '            suggestedPosition.position = startPos;\n' +
    '            return;\n' +
    '        }\n' +
    '        suggestedPosition.newSuggestedEdge = "right";\n' +
    '        suggestedPosition.position = endPos;\n' +
    '    };\n' +
    '\n' +
    '    int getNewMinDistance(int startPos, int endPos, DropPosition dropPos) {\n' +
    '        return (Math.abs(startPos - dropPos.left) < Math.abs(endPos - dropPos.right))\n' +
    '                ? Math.abs(startPos - dropPos.left)\n' +
    '                : Math.abs(endPos - dropPos.right);\n' +
    '    }\n' +
    '}', '@Service\n' +
    'public class SwimLanesService {\n' +
    '    private Map<String, List<SwimLane>> swimLanes;\n' +
    '\n' +
    '    constructor() {\n' +
    '        this.swimLanes = new HashMap<String, List<SwimLane>>();\n' +
    '        this.swimLanes.put(SwimLaneType.VIDEO, new ArrayList<SwimLane>());\n' +
    '        this.swimLanes.put(SwimLaneType.AUDIO, new ArrayList<SwimLane>());\n' +
    '        this.swimLanes.put(SwimLaneType.IMAGE, new ArrayList<SwimLane>());\n' +
    '        this.swimLanes.put(SwimLaneType.TEXT, new ArrayList<SwimLane>());\n' +
    '    }\n' +
    '\n' +
    '    void deactivateAllClips() {\n' +
    '        for(Map.Entry<String, List<SwimLane>> entry : this.swimLanes.entrySet()) {\n' +
    '            entry.getValue().forEach(lane -> {\n' +
    '                for (int i = 0; i < lane.clips.length; i++) {\n' +
    '                    lane.clips[i].active = falce;\n' +
    '                }\n' +
    '            });\n' +
    '        }\n' +
    '    }\n' +
    '}'],
    after: ['@Service\n' +
    'public class SwimLanesService {\n' +
    '    private final ClipsService clipsService;\n' +
    '    private final ZoomService zoomService;\n' +
    '\n' +
    '    ClipDropData clipDropData = new ClipDropData(0, "left");\n' +
    '    SwimLaneType draggingMediaType;\n' +
    '    private Map<String, List<SwimLane>> swimLanes;\n' +
    '    private int pickUpPosition;\n' +
    '    private int timeCursorPosition;\n' +
    '    private Clip activeClip;\n' +
    '    private SwimLaneFactory swimLaneFactory;\n' +
    '\n' +
    '    constructor(ClipsService clipsService, ZoomService zoomService) {\n' +
    '        this.clipsService = clipsService;\n' +
    '        this.zoomService = zoomService;\n' +
    '        this.swimLanes = new HashMap<String, List<SwimLane>>();\n' +
    '        this.swimLanes.put(SwimLaneType.VIDEO, new ArrayList<SwimLane>());\n' +
    '        this.swimLanes.put(SwimLaneType.AUDIO, new ArrayList<SwimLane>());\n' +
    '        this.swimLanes.put(SwimLaneType.IMAGE, new ArrayList<SwimLane>());\n' +
    '        this.swimLanes.put(SwimLaneType.TEXT, new ArrayList<SwimLane>());\n' +
    '        this.swimLaneFactory = new SwimLaneFactory(this.swimLanes);\n' +
    '    }\n' +
    '\n' +
    '    void setActiveClip(Clip clip, boolean openDetails) {\n' +
    '        this.deactivateAllClips();\n' +
    '        this.activeClip = clip;\n' +
    '        this.activeClip.active = true;\n' +
    '    }\n' +
    '\n' +
    '    void setPickUpPosition(int position) {\n' +
    '        this.pickUpPosition = position;\n' +
    '    }\n' +
    '\n' +
    '    void setTimeCursorPosition(int position) {\n' +
    '        this.timeCursorPosition = position;\n' +
    '    }\n' +
    '\n' +
    '    MagnetCursorData changeMagnetCursorPosition(int clientX, SwimLaneType mediaType, Clip clip) {\n' +
    '        int relativePosition = clientX - SwimLaneConstans.getActionLanesWidth() + SwimLaneConstans.getSwimLaneScrollValue();\n' +
    '        DropPosition dropPosition = new DropPosition(-1, -1);\n' +
    '        if (clip != null) {\n' +
    '            dropPosition.left = clip.leftPosition + (clientX - this.pickUpPosition);\n' +
    '            dropPosition.right = clip.rightPosition + (clientX - this.pickUpPosition);\n' +
    '        } else {\n' +
    '            dropPosition.left = relativeMousePosition;\n' +
    '            dropPosition.right = relativeMousePosition + WindowUtil.getClientWidth;\n' +
    '        }\n' +
    '        int magnetCursorPosition = Integer.MAX_VALUE;\n' +
    '        int minDistance = Integer.MAX_VALUE;\n' +
    '        boolean sameLaneChecking = false;\n' +
    '        for (Map.Entry<String, List<SwimLane>> entry : this.swimLanes.entrySet()) {\n' +
    '            for(int i = 0; i < entry.getValue().size(); i++) {\n' +
    '                SwimLane lane = entry.getValue().get(i);\n' +
    '                SuggestedPosition suggestedPosition = new SuggestedPosition(0, 0, this.clipDropData.edge);\n' +
    '                if (clip != null) {\n' +
    '                    sameLaneChecking = lane == SwimLaneUtil.getSwimLaneForClip(clip);\n' +
    '                }\n' +
    '                if (!lane.clips.length) {\n' +
    '                    suggestedPosition.position = 0;\n' +
    '                    suggestedPosition.newMinDistance = Math.abs(dropPosition.left - suggestedPosition.startPosition);\n' +
    '                    suggestedPosition.newSuggestedEdge = "left";\n' +
    '                } else {\n' +
    '                    int indexOfClipAfter = this.clipsService.getIndexOfClip(dropPosition.left, lane.clips, false);\n' +
    '                    int indexOfClipAfterForEndPosition = this.clipsService.getIndexOfClip(dropPosition.right, lane.clips, false);\n' +
    '                    Clip fakeStartClip;\n' +
    '                    Clip fakeStopClip;\n' +
    '                    if (indexOfClipAfter == 0) {\n' +
    '                        fakeStartClip = new Clip(0, 0, new Media());\n' +
    '                        fakeStartClip.setPosition(0, 0);\n' +
    '                        lane.clips.add(0, fakeStartClip);\n' +
    '                        indexOfClipAfter++;\n' +
    '                        indexOfClipAfterForEndPosition++;\n' +
    '                    }\n' +
    '                    if (lane.clips[indexOfClipAfterForEndPosition] != null) {\n' +
    '                        fakeStopClip = new Clip(Integer.MAX_VALUE, Integer.MAX_VALUE, new Media());\n' +
    '                        fakeStopClip.setPosition(Integer.MAX_VALUE, Integer.MAX_VALUE);\n' +
    '                        lane.clips.add(fakeStopClip);\n' +
    '                    }\n' +
    '                    int leftDiff = Math.abs(lane.clips[indexOfClipAfter - 1].rightPosition - dropPosition.left);\n' +
    '                    int rightDiff = Math.abs(lane.clips[indexOfClipAfterForEndPosition].leftPosition - dropPosition.right);\n' +
    '                    if (leftDiff < rightDiff) {\n' +
    '                        suggestedPosition.newSuggestedEdge = "left";\n' +
    '                        suggestedPosition.position = lane.clips[indexOfClipAfter - 1].rightPosition;\n' +
    '                    } else {\n' +
    '                        suggestedPosition.newSuggestedEdge = "right";\n' +
    '                        suggestedPosition.position = lane.clips[indexOfClipAfterForEndPosition].leftPosition;\n' +
    '                    }\n' +
    '                    int leftDist = Math.abs(lane.clips[indexOfClipAfter - 1].rightPosition - dropPosition.left);\n' +
    '                    int rightDist = Math.abs(lane.clips[indexOfClipAfterForEndPosition].leftPosition - dropPosition.right);\n' +
    '                    suggestedPosition.newMinDistance = (leftDist < rightDist)\n' +
    '                            ? Math.abs(lane.clips[indexOfClipAfter - 1].rightPosition - dropPosition.left)\n' +
    '                            : Math.abs(lane.clips[indexOfClipAfterForEndPosition].leftPosition - dropPosition.right);\n' +
    '                    if (!sameLaneChecking) {\n' +
    '                        int alternativeDistance = Math.abs(lane.clips[indexOfClipAfter - 1].leftPosition - dropPosition.left);\n' +
    '                        if (alternativeDistance < suggestedPosition.newMinDistance) {\n' +
    '                            suggestedPosition.newMinDistance = alternativeDistance;\n' +
    '                            suggestedPosition.newSuggestedEdge = "left";\n' +
    '                            suggestedPosition.position = lane.clips[indexOfClipAfter - 1].leftPosition;\n' +
    '                        }\n' +
    '                        alternativeDistance = Math.abs(lane.clips[indexOfClipAfter].leftPosition - dropPosition.left);\n' +
    '                        if (alternativeDistance < newMinDistance) {\n' +
    '                            suggestedPosition.newMinDistance = alternativeDistance;\n' +
    '                            suggestedPosition.newSuggestedEdge = "left";\n' +
    '                            suggestedPosition.position = lane.clips[indexOfClipAfter].leftPosition;\n' +
    '                        }\n' +
    '                        alternativeDistance = Math.abs(lane.clips[indexOfClipAfterForEndPosition - 1].leftPosition - dropPosition.right);\n' +
    '                        if (alternativeDistance < newMinDistance) {\n' +
    '                            suggestedPosition.newMinDistance = alternativeDistance;\n' +
    '                            suggestedPosition.newSuggestedEdge = "right";\n' +
    '                            suggestedPosition.position = lane.clips[indexOfClipAfterForEndPosition - 1].leftPosition;\n' +
    '                        }\n' +
    '                        alternativeDistance = Math.abs(lane.clips[indexOfClipAfterForEndPosition - 1].rightPosition - dropPosition.right);\n' +
    '                        if (alternativeDistance < newMinDistance) {\n' +
    '                            suggestedPosition.newMinDistance = alternativeDistance;\n' +
    '                            suggestedPosition.newSuggestedEdge = "right";\n' +
    '                            suggestedPosition.position = lane.clips[indexOfClipAfterForEndPosition - 1].rightPosition;\n' +
    '                        }\n' +
    '                    }\n' +
    '                }\n' +
    '                if (suggestedPosition.newMinDistance < minDistance) {\n' +
    '                    minDistance = suggestedPosition.newMinDistance;\n' +
    '                    magnetCursorPosition = suggestedPosition.position;\n' +
    '                    this.clipDropData.position = magnetCursorPosition;\n' +
    '                    this.clipDropData.edge = suggestedPosition.newSuggestedEdge;\n' +
    '                }\n' +
    '            }\n' +
    '        }\n' +
    '        return new MagnetCursorData(magnetCursorPosition, mediaType);\n' +
    '    }\n' +
    '\n' +
    '    void cutClip() {\n' +
    '        int timeForPosition = this.zoomService.getTimeForPosition(this.timeCursorPosition);\n' +
    '        if (timeForPosition <= this.activeClip.startTime || this.activeClip.endTime <= timeForPosition) {\n' +
    '            return;\n' +
    '        }\n' +
    '        SwimLane swimLaneByClip = SwimLaneUtil.getSwimLaneForClip(this.activeClip);\n' +
    '        Clip duplicatedClip = new Clip(timeForPosition, this.activeClip.endTime, this.activeClip.media);\n' +
    '        duplicatedClip.setPosition(this.timeCursorPosition, this.activeClip.rightPosition);\n' +
    '        duplicatedClip.active = false;\n' +
    '        this.clipsService.insertClip(duplicatedClip, swimLaneByClip.clips);\n' +
    '        this.activeClip.endTime = timeForPosition - 0.01;\n' +
    '        this.activeClip.setPosition(this.activeClip.leftPosition, this.timeCursorPosition - 1);\n' +
    '        this.activeClip.endTime -= 0.01;\n' +
    '    }\n' +
    '\n' +
    '    void deactivateAllClips() {\n' +
    '        for(Map.Entry<String, List<SwimLane>> entry : this.swimLanes.entrySet()) {\n' +
    '            entry.getValue().forEach(lane -> {\n' +
    '                for (int i = 0; i < lane.clips.length; i++) {\n' +
    '                    lane.clips[i].active = falce;\n' +
    '                }\n' +
    '            });\n' +
    '        }\n' +
    '    }\n' +
    '}']
  }
};
