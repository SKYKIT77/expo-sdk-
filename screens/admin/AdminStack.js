import { createStackNavigator } from '@react-navigation/stack';
import ManageContent from '../screens/admin/ManageContent';
import ManageExercises from '../screens/admin/ManageExercises';
import ManageTactics from '../screens/admin/ManageTactics';
import ManagePrograms from '../screens/admin/ManagePrograms';

const Stack = createStackNavigator();

const AdminStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ManageContent" 
        component={ManageContent}
        options={{ title: 'จัดการเนื้อหา' }}
      />
      <Stack.Screen 
        name="ManageExercises" 
        component={ManageExercises}
        options={{ title: 'จัดการแบบฝึกซ้อม' }}
      />
      <Stack.Screen 
        name="ManageTactics" 
        component={ManageTactics}
        options={{ title: 'จัดการแทคติก' }}
      />
      <Stack.Screen 
        name="ManagePrograms" 
        component={ManagePrograms}
        options={{ title: 'จัดการโปรแกรม' }}
      />
    </Stack.Navigator>
  );
};

export default AdminStack;
