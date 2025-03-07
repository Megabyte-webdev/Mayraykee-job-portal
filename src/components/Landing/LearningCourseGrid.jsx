import { resourceUrl } from '../../services/axios-client';
import LearningCourseCard from './LearningCourseCard'
const LearningCourseGrid = ({ list }) => {
    return (
        <div className="flex item-stretch gap-x-5 overflow-x-auto h-max w-full py-7">
            {
                list?.map((course) => (
                    <LearningCourseCard
                        key={course?.id}
                        title={course?.title}
                        author={course?.program || "program"}
                        price={course?.price}
                        rating="4.0"
                        img={`${resourceUrl}${course?.image}` || "https://via.placeholder.com/150/0000/FFFFFF?text=${title}"}
                    />
                ))}
        </div>
    )
};
export default LearningCourseGrid;